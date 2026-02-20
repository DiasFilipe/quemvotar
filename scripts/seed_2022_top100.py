import argparse
import csv
import datetime as dt
import io
import json
import os
import urllib.request
import zipfile
from collections import defaultdict

VOTES_URL = (
    "https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/"
    "votacao_candidato_munzona_2022.zip"
)
CLIENTS_URL = (
    "https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/"
    "consulta_cand_2022.zip"
)

THEMES = [
    "economia_impostos",
    "emprego_desenvolvimento",
    "seguranca_publica",
    "saude",
    "educacao",
    "infra_mobilidade",
    "meio_ambiente_energia",
    "protecao_social",
    "liberdades_valores",
    "governanca_corrupcao",
]

ALLOWED_CARGOS = {
    "PRESIDENTE",
    "GOVERNADOR",
    "SENADOR",
    "DEPUTADO FEDERAL",
    "DEPUTADO ESTADUAL",
    "DEPUTADO DISTRITAL",
}


def _download(url, path):
    if os.path.exists(path):
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "quemvotar-seed/1.0"},
    )
    with urllib.request.urlopen(req) as resp, open(path, "wb") as fh:
        while True:
            chunk = resp.read(1024 * 1024)
            if not chunk:
                break
            fh.write(chunk)


def _pick_csv_members(members):
    csv_members = [m for m in members if m.lower().endswith(".csv")]
    brasil = [m for m in csv_members if "_BRASIL" in m.upper()]
    if brasil:
        return brasil
    return csv_members


def _open_csv(zf, member):
    raw = zf.open(member)
    return io.TextIOWrapper(raw, encoding="latin-1", newline="")


def _get_value(row, names, required=True):
    for name in names:
        if name in row and row[name] != "":
            return row[name]
    if required:
        raise KeyError(f"Missing columns. Expected one of {names}. Got {list(row.keys())}")
    return ""


def _load_party_map(path):
    if not path or not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _answers_for_party(party, party_map, default_value=3):
    if party in party_map:
        data = party_map[party]
        return {theme: int(data.get(theme, default_value)) for theme in THEMES}
    return {theme: default_value for theme in THEMES}


def build_seed(args):
    raw_dir = os.path.join(args.out_dir, "..", "raw")
    os.makedirs(args.out_dir, exist_ok=True)
    os.makedirs(raw_dir, exist_ok=True)

    votes_zip = os.path.join(raw_dir, "votacao_candidato_munzona_2022.zip")
    cand_zip = os.path.join(raw_dir, "consulta_cand_2022.zip")

    if not args.no_download:
        _download(VOTES_URL, votes_zip)
        _download(CLIENTS_URL, cand_zip)

    party_map = _load_party_map(args.party_map)

    candidate_meta = {}
    with zipfile.ZipFile(cand_zip) as zf:
        members = _pick_csv_members(zf.namelist())
        for member in members:
            with _open_csv(zf, member) as fh:
                reader = csv.DictReader(fh, delimiter=";")
                for row in reader:
                    sq = _get_value(row, ["SQ_CANDIDATO"]).strip()
                    if not sq:
                        continue
                    candidate_meta[sq] = {
                        "sq": sq,
                        "name": _get_value(row, ["NM_URNA_CANDIDATO", "NM_CANDIDATO"]).strip(),
                        "full_name": _get_value(row, ["NM_CANDIDATO"], required=False).strip(),
                        "party": _get_value(row, ["SG_PARTIDO"], required=False).strip(),
                        "office": _get_value(row, ["DS_CARGO"], required=False).strip(),
                        "uf": _get_value(row, ["SG_UF"], required=False).strip(),
                        "ballot_number": _get_value(row, ["NR_CANDIDATO"], required=False).strip(),
                    }

    votes = defaultdict(int)
    with zipfile.ZipFile(votes_zip) as zf:
        members = _pick_csv_members(zf.namelist())
        for member in members:
            with _open_csv(zf, member) as fh:
                reader = csv.DictReader(fh, delimiter=";")
                for row in reader:
                    cargo = _get_value(row, ["DS_CARGO"], required=False).strip().upper()
                    if cargo not in ALLOWED_CARGOS:
                        continue
                    turno = _get_value(row, ["NR_TURNO"], required=False).strip()
                    if args.turno and turno and int(turno) != args.turno:
                        continue
                    sq = _get_value(row, ["SQ_CANDIDATO"], required=True).strip()
                    qt = _get_value(row, ["QT_VOTOS"], required=True).strip()
                    try:
                        qt_int = int(qt)
                    except ValueError:
                        qt_int = 0
                    votes[(cargo, sq)] += qt_int

    by_cargo = defaultdict(list)
    for (cargo, sq), total in votes.items():
        by_cargo[cargo].append((total, sq))

    generated_at = dt.date.today().isoformat()
    candidates_out = []
    answers_out = []

    for cargo, items in by_cargo.items():
        items.sort(key=lambda x: x[0], reverse=True)
        top_items = items[: args.top]
        for total, sq in top_items:
            meta = candidate_meta.get(
                sq,
                {
                    "sq": sq,
                    "name": "",
                    "full_name": "",
                    "party": "",
                    "office": cargo,
                    "uf": "",
                    "ballot_number": "",
                },
            )
            candidate_id = f"2022_{sq}"
            candidates_out.append(
                {
                    "id": candidate_id,
                    "name": meta["name"],
                    "full_name": meta["full_name"],
                    "party": meta["party"],
                    "office": cargo,
                    "uf": meta["uf"],
                    "ballot_number": meta["ballot_number"],
                    "votes_2022": total,
                    "turno": args.turno,
                    "source": {
                        "dataset": "TSE Resultados 2022 - Votacao nominal por municipio e zona",
                        "url": VOTES_URL,
                        "generated_at": generated_at,
                    },
                    "ideology_source": "admin_inferred",
                    "seed_status": "auto_generated",
                }
            )

            answers_out.append(
                {
                    "candidate_id": candidate_id,
                    "party": meta["party"],
                    "answers": _answers_for_party(meta["party"], party_map),
                    "source": "admin_inferred",
                    "confidence": "low",
                    "notes": "Auto-generated seed from 2022 results. Review required.",
                }
            )

    candidates_path = os.path.join(args.out_dir, "candidates_2022_top100.json")
    answers_path = os.path.join(args.out_dir, "candidate_answers_2022_top100.json")

    with open(candidates_path, "w", encoding="utf-8") as fh:
        json.dump(candidates_out, fh, ensure_ascii=False, indent=2)
    with open(answers_path, "w", encoding="utf-8") as fh:
        json.dump(answers_out, fh, ensure_ascii=False, indent=2)

    print(f"Wrote {len(candidates_out)} candidates to {candidates_path}")
    print(f"Wrote {len(answers_out)} answer sets to {answers_path}")


def main():
    parser = argparse.ArgumentParser(description="Seed top N candidates from TSE 2022 datasets.")
    parser.add_argument("--out-dir", default="data/seeds")
    parser.add_argument("--top", type=int, default=100)
    parser.add_argument("--turno", type=int, default=1)
    parser.add_argument("--party-map", default="config/party_ideology_map.json")
    parser.add_argument("--no-download", action="store_true")
    args = parser.parse_args()

    build_seed(args)


if __name__ == "__main__":
    main()
