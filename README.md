# AC appJsonVersionManager

Toto je jednoduché rozšíření pro Visual Studio Code, které umožňuje zvedání verze v souboru `app.json`.

## Popis funkcionality

1. **aktualizace z gitu:**
    - provede příkaz `git checkout [main_branch]`.
        - `[main_branch]` je název hlavní větve, lze nastavit v settings.json (výchozí hodnota je `main`).
    - pokud tento příkaz selže, provede se ještě dodatečný příkaz `git stash`.
    - Provede pull z větve `[main_branch]`, aby získalo nejnovější změny.
    - spustí příkaz `git checkout -`.
    - Sloučí změny z `[main_branch]` zpět do původní větve.

2. **Zvedne verzi v souboru `app.json`:**
   - Rozšíření najde a aktualizuje hodnotu elementu `version` v souboru `app.json`.

## Jak Používat

1. Spusťte příkaz "Package & increase version to latest" ze seznamu příkazů nebo pomocí klávesové zkratky (lze nastavit v paletě příkazů).

2. Po dokončení operací se verze v souboru `app.json` aktualizuje.

**DŮLEŽITÉ:** Pro správné fungování rozšíření musí být otevřený aspoň jeden editor.

## Konfigurace

V souboru `settings.json` je možné nastavit některé hodnoty pro správné fungování rozšíření:
1. **název hlavní větve v repozitáři:**
    - dostupné pod klíčem `ac-appjsonversionmanager.mainBranchName`
    - výchozí hodnota je `main`
2. **formát předposledního čísla verze:**
    - dostupné pod klíčem `ac-appjsonversionmanager.versionFormat`
    - výchozí hodnota je `"yymmdd"` (podle potřeb v Intergramu)
    - povolené hodnoty:
        - `"yymmdd"` - `[poslední 2 číslice roku (23)][měsíc][den]`
        - `"yyyymmdd"` - použije se celý rok (2023)
        - `"autoIncrement"` - číslo se zvedne o 1 nezávisle na předchozí hodnotě
    - poslední číslo verze se **vždy** zvedne o 1

## Připomínky a Kontakt

Pokud máte nějaké připomínky (hlavně asi k formátu verze), otázky nebo návrhy na vylepšení tohoto rozšíření, sem s nimi! Níže je seznam způsobů, jak mi dát vědět:

- **GitHub Issues:**
  - Přidávejte otázky nebo připomínky do [Issues na GitHubu](https://github.com/panSlota/appJsonVersionManager/issues).

- **Email:**
  - Pro osobní dotazy pište sem: [albert.psota@autocont.cz](mailto:albert.psota@autocont.cz).
