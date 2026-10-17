export const languages = [
  { id: 'hr', name: 'Hrvatski' }, { id: 'en', name: 'English' },
  { id: 'de', name: 'Deutsch' }, { id: 'it', name: 'Italiano' },
  { id: 'sl', name: 'Slovenščina' },
]

const rows = [
['Početna','Home','Startseite','Home','Domov'],
['Vozila','Motorcycles','Motorräder','Moto','Motocikli'],
['Servisi','Services','Wartung','Manutenzione','Servisi'],
['Gorivo','Fuel','Kraftstoff','Carburante','Gorivo'],
['Troškovi','Expenses','Ausgaben','Spese','Stroški'],
['Podsjetnici','Reminders','Erinnerungen','Promemoria','Opomniki'],
['Postavke','Settings','Einstellungen','Impostazioni','Nastavitve'],
['Odjava','Log out','Abmelden','Esci','Odjava'],
['Dodaj motocikl','Add motorcycle','Motorrad hinzufügen','Aggiungi moto','Dodaj motocikel'],
['Dodaj vozilo','Add motorcycle','Motorrad hinzufügen','Aggiungi moto','Dodaj motocikel'],
['Dodaj servis','Add service','Wartung hinzufügen','Aggiungi manutenzione','Dodaj servis'],
['Dodaj trošak','Add expense','Ausgabe hinzufügen','Aggiungi spesa','Dodaj strošek'],
['Dodaj podsjetnik','Add reminder','Erinnerung hinzufügen','Aggiungi promemoria','Dodaj opomnik'],
['Spremi','Save','Speichern','Salva','Shrani'],
['Odustani','Cancel','Abbrechen','Annulla','Prekliči'],
['Obriši','Delete','Löschen','Elimina','Izbriši'],
['Uredi','Edit','Bearbeiten','Modifica','Uredi'],
['Nazad','Back','Zurück','Indietro','Nazaj'],
['Datum','Date','Datum','Data','Datum'],
['Iznos','Amount','Betrag','Importo','Znesek'],
['Kategorija','Category','Kategorie','Categoria','Kategorija'],
['Motocikl','Motorcycle','Motorrad','Moto','Motocikel'],
['Ukupno','Total','Gesamt','Totale','Skupaj'],
['Sve kategorije','All categories','Alle Kategorien','Tutte le categorie','Vse kategorije'],
['Svi motocikli','All motorcycles','Alle Motorräder','Tutte le moto','Vsi motocikli'],
['Filtriraj','Filter','Filtern','Filtra','Filtriraj'],
['Poništi filtre','Reset filters','Filter zurücksetzen','Reimposta filtri','Ponastavi filtre'],
['Izvezi PDF','Export PDF','PDF exportieren','Esporta PDF','Izvozi PDF'],
['Nema podataka','No data','Keine Daten','Nessun dato','Ni podatkov'],
['Pregled garaže','Garage overview','Garagenübersicht','Panoramica garage','Pregled garaže'],
['Kilometraža','Mileage','Kilometerstand','Chilometraggio','Kilometrina'],
['Registracija','Registration','Zulassung','Immatricolazione','Registracija'],
['Osiguranje','Insurance','Versicherung','Assicurazione','Zavarovanje'],
['Opis','Description','Beschreibung','Descrizione','Opis'],
['Napomena','Note','Notiz','Nota','Opomba'],
['Pretraži','Search','Suchen','Cerca','Poišči'],
['Mjesečni troškovi','Monthly expenses','Monatliche Ausgaben','Spese mensili','Mesečni stroški'],
['Izvoz sigurnosne kopije','Export backup','Backup exportieren','Esporta backup','Izvoz varnostne kopije'],
['Vraćanje podataka','Restore data','Daten wiederherstellen','Ripristina dati','Obnovitev podatkov'],
['Preuzmi sigurnosnu kopiju','Download backup','Backup herunterladen','Scarica backup','Prenesi varnostno kopijo'],
['Odaberi JSON datoteku','Choose JSON file','JSON-Datei auswählen','Scegli file JSON','Izberi datoteko JSON'],
['Potvrdi i zamijeni podatke','Confirm and replace data','Bestätigen und Daten ersetzen','Conferma e sostituisci i dati','Potrdi in zamenjaj podatke'],
['Potvrdi vraćanje sigurnosne kopije','Confirm backup restoration','Backup-Wiederherstellung bestätigen','Conferma ripristino backup','Potrdi obnovitev varnostne kopije'],
['Izgled aplikacije','Application appearance','Erscheinungsbild','Aspetto applicazione','Videz aplikacije'],
['Jezik aplikacije','Application language','App-Sprache','Lingua applicazione','Jezik aplikacije'],
['Tamna','Dark','Dunkel','Scuro','Temna'],
['Svijetla','Light','Hell','Chiaro','Svetla'],
['Plava','Blue','Blau','Blu','Modra'],
['Grafitna','Graphite','Graphit','Grafite','Grafitna'],
['Smaragdna','Emerald','Smaragd','Smeraldo','Smaragdna'],
['Ljubičasta','Purple','Violett','Viola','Vijolična'],
]

const additionalRows = [['NAPREDNA STATISTIKA', 'ADVANCED STATISTICS', 'ERWEITERTE STATISTIK', 'STATISTICHE AVANZATE', 'NAPREDNA STATISTIKA'], ['Usporedba motocikala', 'Motorcycle comparison', 'Motorradvergleich', 'Confronto moto', 'Primerjava motociklov'], ['Usporedi evidentirane troškove, raspodjelu i mjesečne trendove.', 'Compare recorded costs, breakdowns and monthly trends.', 'Vergleiche erfasste Kosten, Verteilung und Monatstrends.', 'Confronta costi, ripartizione e andamento mensile.', 'Primerjaj zabeležene stroške, razdelitev in mesečne trende.'], ['Ukupni troškovi po motociklu', 'Total expenses by motorcycle', 'Gesamtkosten pro Motorrad', 'Spese totali per moto', 'Skupni stroški po motociklu'], ['Raspodjela troškova', 'Expense breakdown', 'Kostenverteilung', 'Ripartizione delle spese', 'Razdelitev stroškov'], ['Mjesečni trend troškova', 'Monthly expense trend', 'Monatlicher Kostentrend', 'Andamento mensile delle spese', 'Mesečni trend stroškov'], ['Po kilometru', 'Per kilometre', 'Pro Kilometer', 'Per chilometro', 'Na kilometer'], ['Ukupni trošak', 'Total cost', 'Gesamtkosten', 'Costo totale', 'Skupni strošek'], ['Ostalo', 'Other', 'Sonstiges', 'Altro', 'Ostalo'], ['Dodaj motocikl za prikaz statistike.', 'Add a motorcycle to view statistics.', 'Füge ein Motorrad hinzu, um Statistiken zu sehen.', 'Aggiungi una moto per vedere le statistiche.', 'Dodaj motocikel za prikaz statistike.'], ['Nema evidentiranih troškova s datumom.', 'No dated expenses recorded.', 'Keine datierten Kosten erfasst.', 'Nessuna spesa datata registrata.', 'Ni zabeleženih stroškov z datumom.'], ['Ukupno za prikazane mjesece:', 'Total for displayed months:', 'Gesamt für angezeigte Monate:', 'Totale per i mesi visualizzati:', 'Skupaj za prikazane mesece:'], ['VIRTUALNA GARAŽA', 'VIRTUAL GARAGE', 'VIRTUELLE GARAGE', 'GARAGE VIRTUALE', 'VIRTUALNA GARAŽA'], ['MOJA GARAŽA', 'MY GARAGE', 'MEINE GARAGE', 'IL MIO GARAGE', 'MOJA GARAŽA'], ['Moji motocikli', 'My motorcycles', 'Meine Motorräder', 'Le mie moto', 'Moji motocikli'], ['Marka', 'Brand', 'Marke', 'Marca', 'Znamka'], ['Model', 'Model', 'Modell', 'Modello', 'Model'], ['Godina', 'Year', 'Baujahr', 'Anno', 'Leto'], ['Benzin', 'Petrol', 'Benzin', 'Benzina', 'Bencin'], ['Dizel', 'Diesel', 'Diesel', 'Diesel', 'Dizel'], ['Električni', 'Electric', 'Elektrisch', 'Elettrico', 'Električni'], ['Odaberi gorivo', 'Choose fuel type', 'Kraftstoffart wählen', 'Seleziona carburante', 'Izberi gorivo'], ['Početna kilometraža evidencije (km)', 'Starting recorded mileage (km)', 'Anfangskilometerstand (km)', 'Chilometraggio iniziale (km)', 'Začetna kilometrina evidence (km)'], ['Početna kilometraža evidencije', 'Starting recorded mileage', 'Anfangskilometerstand', 'Chilometraggio iniziale', 'Začetna kilometrina evidence'], ['Nema fotografije', 'No photo', 'Kein Foto', 'Nessuna foto', 'Ni fotografije'], ['Fotografija motocikla', 'Motorcycle photo', 'Motorradfoto', 'Foto della moto', 'Fotografija motocikla'], ['Još nema fotografije ovog motocikla.', 'No photo of this motorcycle yet.', 'Noch kein Foto dieses Motorrads.', 'Nessuna foto di questa moto.', 'Fotografije tega motocikla še ni.'], ['Detalji motocikla', 'Motorcycle details', 'Motorraddetails', 'Dettagli moto', 'Podrobnosti motocikla'], ['Podaci o motociklu', 'Motorcycle information', 'Motorraddaten', 'Dati della moto', 'Podatki o motociklu'], ['Uredi motocikl', 'Edit motorcycle', 'Motorrad bearbeiten', 'Modifica moto', 'Uredi motocikel'], ['Servisna povijest', 'Service history', 'Wartungsverlauf', 'Storico manutenzione', 'Zgodovina servisov'], ['Unesi podatke o obavljenom servisu.', 'Enter the completed service details.', 'Daten zur durchgeführten Wartung eingeben.', 'Inserisci i dettagli della manutenzione.', 'Vnesi podatke o opravljenem servisu.'], ['Nema evidentiranih servisa', 'No services recorded', 'Keine Wartungen erfasst', 'Nessuna manutenzione registrata', 'Ni zabeleženih servisov'], ['Troškovi motocikla', 'Motorcycle expenses', 'Motorradkosten', 'Spese della moto', 'Stroški motocikla'], ['Broj troškova', 'Expense count', 'Anzahl der Ausgaben', 'Numero di spese', 'Število stroškov'], ['Ukupno potrošeno', 'Total spent', 'Gesamtausgaben', 'Totale speso', 'Skupaj porabljeno'], ['Nema evidentiranih troškova', 'No expenses recorded', 'Keine Ausgaben erfasst', 'Nessuna spesa registrata', 'Ni zabeleženih stroškov'], ['Filtriranje troškova', 'Expense filters', 'Ausgabenfilter', 'Filtri spese', 'Filtriranje stroškov'], ['Pronađi troškove prema motociklu, kategoriji i razdoblju.', 'Find expenses by motorcycle, category and date range.', 'Ausgaben nach Motorrad, Kategorie und Zeitraum suchen.', 'Trova spese per moto, categoria e periodo.', 'Poišči stroške po motociklu, kategoriji in obdobju.'], ['Datum od', 'From date', 'Von Datum', 'Data iniziale', 'Datum od'], ['Datum do', 'To date', 'Bis Datum', 'Data finale', 'Datum do'], ['Poredak', 'Sort order', 'Sortierung', 'Ordinamento', 'Razvrstitev'], ['Najnoviji prvo', 'Newest first', 'Neueste zuerst', 'Più recenti prima', 'Najnovejši najprej'], ['Najstariji prvo', 'Oldest first', 'Älteste zuerst', 'Meno recenti prima', 'Najstarejši najprej'], ['Najveći iznos prvo', 'Highest amount first', 'Höchster Betrag zuerst', 'Importo più alto prima', 'Najvišji znesek najprej'], ['Najmanji iznos prvo', 'Lowest amount first', 'Niedrigster Betrag zuerst', 'Importo più basso prima', 'Najnižji znesek najprej'], ['Prikazano', 'Shown', 'Angezeigt', 'Visualizzati', 'Prikazano'], ['Ukupno u odabiru', 'Selected total', 'Summe der Auswahl', 'Totale selezione', 'Skupaj v izboru'], ['Nema troškova za odabrane filtre', 'No expenses match the filters', 'Keine Ausgaben für diese Filter', 'Nessuna spesa corrisponde ai filtri', 'Ni stroškov za izbrane filtre'], ['Promijeni razdoblje ili poništi filtre.', 'Change the date range or reset filters.', 'Zeitraum ändern oder Filter zurücksetzen.', 'Modifica il periodo o reimposta i filtri.', 'Spremeni obdobje ali ponastavi filtre.'], ['Detaljna statistika goriva', 'Detailed fuel statistics', 'Detaillierte Kraftstoffstatistik', 'Statistiche carburante dettagliate', 'Podrobna statistika goriva'], ['Prosječna cijena litre', 'Average price per litre', 'Durchschnittspreis pro Liter', 'Prezzo medio al litro', 'Povprečna cena litra'], ['Najniža cijena litre', 'Lowest price per litre', 'Niedrigster Literpreis', 'Prezzo minimo al litro', 'Najnižja cena litra'], ['Najviša cijena litre', 'Highest price per litre', 'Höchster Literpreis', 'Prezzo massimo al litro', 'Najvišja cena litra'], ['Trošak goriva po kilometru', 'Fuel cost per kilometre', 'Kraftstoffkosten pro Kilometer', 'Costo carburante per chilometro', 'Strošek goriva na kilometer'], ['Benzinska postaja', 'Petrol station', 'Tankstelle', 'Distributore', 'Bencinska črpalka'], ['Spremnik', 'Tank', 'Tank', 'Serbatoio', 'Rezervoar'], ['Napunjeno do vrha', 'Filled to full', 'Vollgetankt', 'Pieno completo', 'Napolnjeno do vrha'], ['Prikaži točenja za motocikl', 'Show refuelling for motorcycle', 'Tankvorgänge für Motorrad anzeigen', 'Mostra rifornimenti per moto', 'Prikaži točenja za motocikel'], ['Za ovaj motocikl još nema evidentiranih točenja.', 'No refuelling records for this motorcycle yet.', 'Für dieses Motorrad gibt es noch keine Tankvorgänge.', 'Nessun rifornimento registrato per questa moto.', 'Za ta motocikel še ni zabeleženih točenj.'], ['Prikaži podsjetnike', 'Show reminders', 'Erinnerungen anzeigen', 'Mostra promemoria', 'Prikaži opomnike'], ['Svi rokovi', 'All deadlines', 'Alle Fristen', 'Tutte le scadenze', 'Vsi roki'], ['Istekli', 'Overdue', 'Abgelaufen', 'Scaduti', 'Potekli'], ['Uskoro (7 dana)', 'Soon (7 days)', 'Bald (7 Tage)', 'Presto (7 giorni)', 'Kmalu (7 dni)'], ['Aktivni', 'Active', 'Aktiv', 'Attivi', 'Aktivni'], ['Nema podsjetnika za odabrani status', 'No reminders for this status', 'Keine Erinnerungen für diesen Status', 'Nessun promemoria per questo stato', 'Ni opomnikov za izbrano stanje'], ['Dobrodošao u svoju garažu', 'Welcome to your garage', 'Willkommen in deiner Garage', 'Benvenuto nel tuo garage', 'Dobrodošel v svoji garaži'], ['U tvojoj garaži', 'In your garage', 'In deiner Garage', 'Nel tuo garage', 'V tvoji garaži'], ['VAŽNI ROKOVI', 'IMPORTANT DEADLINES', 'WICHTIGE FRISTEN', 'SCADENZE IMPORTANTI', 'POMEMBNI ROKI'], ['Podsjetnici koji traže pažnju', 'Reminders needing attention', 'Wichtige Erinnerungen', 'Promemoria da controllare', 'Opomniki, ki potrebujejo pozornost'], ['ANALIZA TROŠKOVA', 'COST ANALYSIS', 'KOSTENANALYSE', 'ANALISI DELLE SPESE', 'ANALIZA STROŠKOV'], ['Trošak vlasništva po motociklu', 'Ownership cost by motorcycle', 'Besitzkosten pro Motorrad', 'Costo di possesso per moto', 'Stroški lastništva po motociklu'], ['Zbroj evidentiranog goriva, servisa i ostalih troškova.', 'Sum of recorded fuel, services and other expenses.', 'Summe aus Kraftstoff, Wartung und sonstigen Kosten.', 'Somma di carburante, manutenzione e altre spese.', 'Vsota goriva, servisov in drugih stroškov.'], ['Ukupno evidentirano', 'Total recorded', 'Insgesamt erfasst', 'Totale registrato', 'Skupaj evidentirano'], ['Upravljanje sigurnosnim kopijama podataka garaže.', 'Manage garage data backups.', 'Sicherungen deiner Garagendaten verwalten.', 'Gestisci i backup dei dati del garage.', 'Upravljanje varnostnih kopij garaže.'], ['Odaberi izgled cijele garaže. Promjene se automatski spremaju.', 'Choose your garage appearance. Changes save automatically.', 'Wähle das Erscheinungsbild. Änderungen werden automatisch gespeichert.', 'Scegli l’aspetto del garage. Le modifiche si salvano automaticamente.', 'Izberi videz garaže. Spremembe se samodejno shranijo.'], ['Preuzmi motocikle, servise, gorivo, troškove, podsjetnike i fotografije u jednoj JSON datoteci.', 'Download motorcycles, services, fuel, expenses, reminders and photos in one JSON file.', 'Motorräder, Wartungen, Kraftstoff, Ausgaben, Erinnerungen und Fotos in einer JSON-Datei herunterladen.', 'Scarica moto, manutenzioni, carburante, spese, promemoria e foto in un file JSON.', 'Prenesi motocikle, servise, gorivo, stroške, opomnike in fotografije v eni datoteki JSON.'], ['Odaberi prethodno spremljenu JSON datoteku. Prije zamjene podataka prikazat će se potvrda.', 'Select a saved JSON file. You will be asked to confirm before replacing data.', 'Wähle eine gespeicherte JSON-Datei. Vor dem Ersetzen wird eine Bestätigung angezeigt.', 'Seleziona un file JSON salvato. Conferma prima di sostituire i dati.', 'Izberi shranjeno datoteko JSON. Pred zamenjavo podatkov bo potrebna potrditev.'], ['Postojeći podaci ovog korisnika bit će zamijenjeni. Prije nastavka preporučujemo izvoz trenutačnih podataka.', 'This user’s existing data will be replaced. Export current data first.', 'Bestehende Daten dieses Nutzers werden ersetzt. Exportiere sie zuerst.', 'I dati esistenti saranno sostituiti. Esporta prima i dati attuali.', 'Obstoječi podatki uporabnika bodo zamenjani. Najprej jih izvozi.'], ['Sigurnosna kopija sprema se na tvoje računalo. Ne uključuje korisničke lozinke ni podatke drugih korisnika.', 'The backup is saved to your computer. It excludes passwords and other users’ data.', 'Die Sicherung wird auf deinem Computer gespeichert. Ohne Passwörter oder Daten anderer Nutzer.', 'Il backup viene salvato sul computer. Esclude password e dati di altri utenti.', 'Kopija se shrani v računalnik. Ne vključuje gesel ali podatkov drugih uporabnikov.'], ['Sigurnosna kopija uspješno je preuzeta.', 'Backup downloaded successfully.', 'Sicherung erfolgreich heruntergeladen.', 'Backup scaricato correttamente.', 'Varnostna kopija je uspešno prenesena.'], ['Izvoz nije uspio.', 'Export failed.', 'Export fehlgeschlagen.', 'Esportazione non riuscita.', 'Izvoz ni uspel.'], ['Datoteka nije ispravna.', 'Invalid file.', 'Ungültige Datei.', 'File non valido.', 'Neveljavna datoteka.'], ['Vraćanje podataka nije uspjelo.', 'Data restoration failed.', 'Datenwiederherstellung fehlgeschlagen.', 'Ripristino non riuscito.', 'Obnovitev podatkov ni uspela.'], ['Pričekaj...', 'Please wait...', 'Bitte warten...', 'Attendere...', 'Počakaj...'], ['Vraćanje...', 'Restoring...', 'Wiederherstellen...', 'Ripristino...', 'Obnavljanje...'], ['Molimo ispuni sva polja.', 'Please fill in all fields.', 'Bitte alle Felder ausfüllen.', 'Compila tutti i campi.', 'Izpolni vsa polja.'], ['Kilometraža ne može biti negativna.', 'Mileage cannot be negative.', 'Kilometerstand darf nicht negativ sein.', 'Il chilometraggio non può essere negativo.', 'Kilometrina ne sme biti negativna.'], ['Cijena servisa mora biti veća od 0.', 'Service cost must be greater than zero.', 'Wartungskosten müssen größer als null sein.', 'Il costo deve essere maggiore di zero.', 'Cena servisa mora biti večja od nič.'], ['Odabrani motocikl nije pronađen.', 'Selected motorcycle not found.', 'Ausgewähltes Motorrad nicht gefunden.', 'Moto selezionata non trovata.', 'Izbranega motocikla ni mogoče najti.']]

const completeUiRows = [
  [
    "TVOJI MOTOCIKLI. TVOJA PRIČA.",
    "YOUR MOTORCYCLES. YOUR STORY.",
    "DEINE MOTORRÄDER. DEINE GESCHICHTE.",
    "LE TUE MOTO. LA TUA STORIA.",
    "TVOJI MOTOCIKLI. TVOJA ZGODBA."
  ],
  [
    "Prijava",
    "Sign in",
    "Anmelden",
    "Accedi",
    "Prijava"
  ],
  [
    "Ime",
    "Name",
    "Name",
    "Nome",
    "Ime"
  ],
  [
    "E-mail adresa",
    "Email address",
    "E-Mail-Adresse",
    "Indirizzo email",
    "E-poštni naslov"
  ],
  [
    "Lozinka",
    "Password",
    "Passwort",
    "Password",
    "Geslo"
  ],
  [
    "Virtualna garaža za motocikle",
    "Virtual motorcycle garage",
    "Virtuelle Motorradgarage",
    "Garage virtuale per moto",
    "Virtualna garaža za motocikle"
  ],
  [
    "Virtualna",
    "Virtual",
    "Virtuelle",
    "Virtuale",
    "Virtualna"
  ],
  [
    "Garaža",
    "Garage",
    "Garage",
    "Garage",
    "Garaža"
  ],
  [
    "← Natrag na motocikle",
    "← Back to motorcycles",
    "← Zurück zu den Motorrädern",
    "← Torna alle moto",
    "← Nazaj na motocikle"
  ],
  [
    "Ukloni fotografiju",
    "Remove photo",
    "Foto entfernen",
    "Rimuovi foto",
    "Odstrani fotografijo"
  ],
  [
    "Odaberi sliku do 8 MB. Fotografija se sprema uz ovaj motocikl.",
    "Choose an image up to 8 MB. The photo is saved with this motorcycle.",
    "Wähle ein Bild bis 8 MB. Das Foto wird bei diesem Motorrad gespeichert.",
    "Scegli un'immagine fino a 8 MB. La foto viene salvata con questa moto.",
    "Izberi sliko do 8 MB. Fotografija se shrani s tem motociklom."
  ],
  [
    "Izmijeni osnovne podatke svog motocikla.",
    "Edit your motorcycle's basic information.",
    "Bearbeite die Grunddaten deines Motorrads.",
    "Modifica i dati principali della tua moto.",
    "Uredi osnovne podatke svojega motocikla."
  ],
  [
    "Spremi servis",
    "Save service",
    "Wartung speichern",
    "Salva manutenzione",
    "Shrani servis"
  ],
  [
    "Dodaj prvi servis ovog motocikla kako bi imao pregled održavanja.",
    "Add the first service to track this motorcycle's maintenance.",
    "Füge die erste Wartung hinzu, um die Wartung dieses Motorrads zu verfolgen.",
    "Aggiungi la prima manutenzione per monitorare gli interventi su questa moto.",
    "Dodaj prvi servis za pregled vzdrževanja tega motocikla."
  ],
  [
    "+ Dodaj prvi servis",
    "+ Add first service",
    "+ Erste Wartung hinzufügen",
    "+ Aggiungi prima manutenzione",
    "+ Dodaj prvi servis"
  ],
  [
    "Evidencija troškova za ovaj motocikl.",
    "Expense records for this motorcycle.",
    "Kostenerfassung für dieses Motorrad.",
    "Registro spese di questa moto.",
    "Evidenca stroškov za ta motocikel."
  ],
  [
    "Troškove možeš dodati na stranici Troškovi. Kada ih povežeš s ovim motociklom, prikazat će se ovdje.",
    "Add expenses on the Expenses page. Once linked to this motorcycle, they will appear here.",
    "Du kannst Ausgaben auf der Seite Ausgaben hinzufügen. Sobald sie diesem Motorrad zugeordnet sind, erscheinen sie hier.",
    "Aggiungi le spese nella pagina Spese. Una volta associate a questa moto, appariranno qui.",
    "Stroške lahko dodaš na strani Stroški. Ko jih povežeš s tem motociklom, se prikažejo tukaj."
  ],
  [
    "Obriši motocikl",
    "Delete motorcycle",
    "Motorrad löschen",
    "Elimina moto",
    "Izbriši motocikel"
  ],
  [
    "EVIDENCIJA",
    "RECORDS",
    "ERFASSUNG",
    "REGISTRO",
    "EVIDENCA"
  ],
  [
    "Prati točenja goriva, kilometražu i troškove svojih motocikala.",
    "Track refuelling, mileage and motorcycle costs.",
    "Verfolge Tankvorgänge, Kilometerstand und Kosten deiner Motorräder.",
    "Monitora rifornimenti, chilometraggio e costi delle tue moto.",
    "Spremljaj točenja goriva, kilometrino in stroške motociklov."
  ],
  [
    "Prvo dodaj motocikl",
    "Add a motorcycle first",
    "Füge zuerst ein Motorrad hinzu",
    "Aggiungi prima una moto",
    "Najprej dodaj motocikel"
  ],
  [
    "Za evidenciju goriva potrebno je prvo dodati motocikl u svoju garažu.",
    "Add a motorcycle to your garage before recording fuel.",
    "Füge zuerst ein Motorrad zur Garage hinzu, um Tankvorgänge zu erfassen.",
    "Aggiungi una moto al garage prima di registrare i rifornimenti.",
    "Pred beleženjem goriva dodaj motocikel v garažo."
  ],
  [
    "Ukupno točenja",
    "Total refuellings",
    "Tankvorgänge insgesamt",
    "Rifornimenti totali",
    "Skupaj točenj"
  ],
  [
    "Ukupno goriva",
    "Total fuel",
    "Kraftstoff gesamt",
    "Carburante totale",
    "Skupaj goriva"
  ],
  [
    "Ukupno potrošeno",
    "Total spent",
    "Gesamtausgaben",
    "Totale speso",
    "Skupaj porabljeno"
  ],
  [
    "Prosječna potrošnja",
    "Average consumption",
    "Durchschnittsverbrauch",
    "Consumo medio",
    "Povprečna poraba"
  ],
  [
    "Pregled cijena goriva i troška po kilometru. Za točan izračun odaberi pojedini motocikl.",
    "Review fuel prices and cost per kilometre. Select one motorcycle for an accurate calculation.",
    "Überprüfe Kraftstoffpreise und Kosten pro Kilometer. Wähle für eine genaue Berechnung ein Motorrad.",
    "Controlla prezzi del carburante e costo al chilometro. Seleziona una moto per un calcolo preciso.",
    "Preglej cene goriva in strošek na kilometer. Za natančen izračun izberi motocikel."
  ],
  [
    "Statistika za motocikl",
    "Motorcycle statistics",
    "Motorradstatistik",
    "Statistiche moto",
    "Statistika motocikla"
  ],
  [
    "Odaberi motocikl",
    "Select motorcycle",
    "Motorrad auswählen",
    "Seleziona moto",
    "Izberi motocikel"
  ],
  [
    "Količina goriva",
    "Fuel quantity",
    "Kraftstoffmenge",
    "Quantità carburante",
    "Količina goriva"
  ],
  [
    "Cijena po litri (€/L)",
    "Price per litre (€/L)",
    "Preis pro Liter (€/L)",
    "Prezzo al litro (€/L)",
    "Cena na liter (€/L)"
  ],
  [
    "Ukupna cijena točenja (€)",
    "Total refuelling cost (€)",
    "Tankkosten insgesamt (€)",
    "Costo totale rifornimento (€)",
    "Skupna cena točenja (€)"
  ],
  [
    "Benzinska postaja (neobavezno)",
    "Petrol station (optional)",
    "Tankstelle (optional)",
    "Distributore (facoltativo)",
    "Bencinska črpalka (neobvezno)"
  ],
  [
    "Spremnik napunjen do vrha",
    "Tank filled completely",
    "Tank vollständig gefüllt",
    "Serbatoio pieno",
    "Rezervoar napolnjen do vrha"
  ],
  [
    "Nema evidentiranih točenja",
    "No refuellings recorded",
    "Keine Tankvorgänge erfasst",
    "Nessun rifornimento registrato",
    "Ni zabeleženih točenj"
  ],
  [
    "Dodaj prvo točenje goriva kako bi mogao pratiti potrošnju i troškove.",
    "Record your first refuelling to track consumption and costs.",
    "Erfasse den ersten Tankvorgang, um Verbrauch und Kosten zu verfolgen.",
    "Registra il primo rifornimento per monitorare consumi e costi.",
    "Dodaj prvo točenje za spremljanje porabe in stroškov."
  ],
  [
    "+ Dodaj prvo točenje",
    "+ Add first refuelling",
    "+ Ersten Tankvorgang hinzufügen",
    "+ Aggiungi primo rifornimento",
    "+ Dodaj prvo točenje"
  ],
  [
    "Cijena",
    "Price",
    "Preis",
    "Prezzo",
    "Cena"
  ],
  [
    "Cijena po litri",
    "Price per litre",
    "Preis pro Liter",
    "Prezzo al litro",
    "Cena na liter"
  ],
  [
    "Pregled svih važnih podataka o tvojim motociklima na jednom mjestu.",
    "All important motorcycle information in one place.",
    "Alle wichtigen Motorraddaten an einem Ort.",
    "Tutte le informazioni importanti sulle tue moto in un unico posto.",
    "Vsi pomembni podatki o motociklih na enem mestu."
  ],
  [
    "· MOTOCIKL",
    "· MOTORCYCLE",
    "· MOTORRAD",
    "· MOTO",
    "· MOTOCIKEL"
  ],
  [
    "Motocikli",
    "Motorcycles",
    "Motorräder",
    "Moto",
    "Motocikli"
  ],
  [
    "u garaži",
    "in garage",
    "in der Garage",
    "nel garage",
    "v garaži"
  ],
  [
    "evidentirano",
    "recorded",
    "erfasst",
    "registrati",
    "zabeleženo"
  ],
  [
    "ukupno natočeno",
    "total refuelled",
    "insgesamt getankt",
    "carburante totale",
    "skupaj natočeno"
  ],
  [
    "Potrošnja",
    "Consumption",
    "Verbrauch",
    "Consumo",
    "Poraba"
  ],
  [
    "GARAŽA",
    "GARAGE",
    "GARAGE",
    "GARAGE",
    "GARAŽA"
  ],
  [
    "Još nemaš dodanih motocikala.",
    "No motorcycles added yet.",
    "Noch keine Motorräder hinzugefügt.",
    "Non hai ancora aggiunto moto.",
    "Nisi še dodal motociklov."
  ],
  [
    "ROKOVI",
    "DEADLINES",
    "FRISTEN",
    "SCADENZE",
    "ROKI"
  ],
  [
    "Nadolazeći podsjetnici",
    "Upcoming reminders",
    "Anstehende Erinnerungen",
    "Promemoria in arrivo",
    "Prihajajoči opomniki"
  ],
  [
    "Nema nadolazećih podsjetnika.",
    "No upcoming reminders.",
    "Keine anstehenden Erinnerungen.",
    "Nessun promemoria in arrivo.",
    "Ni prihajajočih opomnikov."
  ],
  [
    "SERVIS",
    "SERVICE",
    "WARTUNG",
    "MANUTENZIONE",
    "SERVIS"
  ],
  [
    "Posljednji servis",
    "Latest service",
    "Letzte Wartung",
    "Ultima manutenzione",
    "Zadnji servis"
  ],
  [
    "Još nema evidentiranih servisa.",
    "No services recorded yet.",
    "Noch keine Wartungen erfasst.",
    "Nessuna manutenzione registrata.",
    "Ni še zabeleženih servisov."
  ],
  [
    "GORIVO",
    "FUEL",
    "KRAFTSTOFF",
    "CARBURANTE",
    "GORIVO"
  ],
  [
    "Posljednje točenje",
    "Latest refuelling",
    "Letzter Tankvorgang",
    "Ultimo rifornimento",
    "Zadnje točenje"
  ],
  [
    "Još nema evidentiranih točenja.",
    "No refuellings recorded yet.",
    "Noch keine Tankvorgänge erfasst.",
    "Nessun rifornimento registrato.",
    "Ni še zabeleženih točenj."
  ],
  [
    "ORGANIZACIJA",
    "ORGANISATION",
    "ORGANISATION",
    "ORGANIZZAZIONE",
    "ORGANIZACIJA"
  ],
  [
    "Prati važne rokove i obaveze vezane uz svoje motocikle.",
    "Track important motorcycle deadlines and tasks.",
    "Verfolge wichtige Fristen und Aufgaben rund um deine Motorräder.",
    "Tieni sotto controllo scadenze e impegni delle tue moto.",
    "Spremljaj pomembne roke in obveznosti za svoje motocikle."
  ],
  [
    "Za dodavanje podsjetnika potrebno je prvo dodati motocikl u svoju garažu.",
    "Add a motorcycle before creating reminders.",
    "Füge zuerst ein Motorrad hinzu, um Erinnerungen zu erstellen.",
    "Aggiungi una moto prima di creare promemoria.",
    "Pred dodajanjem opomnikov dodaj motocikel v garažo."
  ],
  [
    "Ukupno podsjetnika",
    "Total reminders",
    "Erinnerungen insgesamt",
    "Promemoria totali",
    "Skupaj opomnikov"
  ],
  [
    "Uskoro",
    "Soon",
    "Bald",
    "A breve",
    "Kmalu"
  ],
  [
    "Isteklo",
    "Expired",
    "Abgelaufen",
    "Scaduti",
    "Poteklo"
  ],
  [
    "Vrsta",
    "Type",
    "Art",
    "Tipo",
    "Vrsta"
  ],
  [
    "Odaberi vrstu",
    "Select type",
    "Art auswählen",
    "Seleziona tipo",
    "Izberi vrsto"
  ],
  [
    "Tehnički pregled",
    "Technical inspection",
    "Hauptuntersuchung",
    "Revisione",
    "Tehnični pregled"
  ],
  [
    "Gume",
    "Tyres",
    "Reifen",
    "Pneumatici",
    "Pnevmatike"
  ],
  [
    "Naziv",
    "Title",
    "Titel",
    "Titolo",
    "Naziv"
  ],
  [
    "Nema podsjetnika",
    "No reminders",
    "Keine Erinnerungen",
    "Nessun promemoria",
    "Ni opomnikov"
  ],
  [
    "Dodaj prvi podsjetnik kako bi lakše pratio važne rokove.",
    "Add your first reminder to keep track of deadlines.",
    "Erstelle deine erste Erinnerung, um Fristen im Blick zu behalten.",
    "Aggiungi il primo promemoria per seguire le scadenze.",
    "Dodaj prvi opomnik za lažje spremljanje rokov."
  ],
  [
    "+ Dodaj prvi podsjetnik",
    "+ Add first reminder",
    "+ Erste Erinnerung hinzufügen",
    "+ Aggiungi primo promemoria",
    "+ Dodaj prvi opomnik"
  ],
  [
    "prikazano",
    "shown",
    "angezeigt",
    "visualizzati",
    "prikazano"
  ],
  [
    "Sigurnosna kopija od",
    "Backup from",
    "Sicherung vom",
    "Backup del",
    "Varnostna kopija z dne"
  ],
  [
    "sadrži",
    "contains",
    "enthält",
    "contiene",
    "vsebuje"
  ],
  [
    "motocikala,",
    "motorcycles,",
    "Motorräder,",
    "moto,",
    "motociklov,"
  ],
  [
    "servisa,",
    "services,",
    "Wartungen,",
    "manutenzioni,",
    "servisov,"
  ],
  [
    "točenja,",
    "refuelling records,",
    "Tankvorgänge,",
    "rifornimenti,",
    "točenj,"
  ],
  [
    "troškova i",
    "expenses and",
    "Ausgaben und",
    "spese e",
    "stroškov in"
  ],
  [
    "podsjetnika.",
    "reminders.",
    "Erinnerungen.",
    "promemoria.",
    "opomnikov."
  ],
  [
    "ODRŽAVANJE",
    "MAINTENANCE",
    "WARTUNG",
    "MANUTENZIONE",
    "VZDRŽEVANJE"
  ],
  [
    "Pregledaj i evidentiraj servise svih svojih motocikala.",
    "View and record maintenance for all your motorcycles.",
    "Sieh dir die Wartungen aller Motorräder an und erfasse neue.",
    "Visualizza e registra le manutenzioni di tutte le moto.",
    "Pregleduj in beleži servise vseh svojih motociklov."
  ],
  [
    "Za evidentiranje servisa potrebno je prvo dodati motocikl u svoju garažu.",
    "Add a motorcycle before recording maintenance.",
    "Füge zuerst ein Motorrad hinzu, um Wartungen zu erfassen.",
    "Aggiungi una moto prima di registrare la manutenzione.",
    "Pred beleženjem servisov dodaj motocikel v garažo."
  ],
  [
    "Ukupno servisa",
    "Total services",
    "Wartungen insgesamt",
    "Manutenzioni totali",
    "Skupaj servisov"
  ],
  [
    "Dodaj prvi servis kako bi imao pregled održavanja svojih motocikala.",
    "Add your first service to start tracking maintenance.",
    "Füge die erste Wartung hinzu, um die Wartung zu verfolgen.",
    "Aggiungi la prima manutenzione per iniziare a monitorare gli interventi.",
    "Dodaj prvi servis za pregled vzdrževanja motociklov."
  ],
  [
    "FINANCIJE",
    "FINANCES",
    "FINANZEN",
    "FINANZE",
    "FINANCE"
  ],
  [
    "Prati sve troškove povezane sa svojim motociklima.",
    "Track all expenses related to your motorcycles.",
    "Verfolge alle Ausgaben rund um deine Motorräder.",
    "Monitora tutte le spese relative alle tue moto.",
    "Spremljaj vse stroške svojih motociklov."
  ],
  [
    "Za evidenciju troškova potrebno je prvo dodati motocikl u svoju garažu.",
    "Add a motorcycle before recording expenses.",
    "Füge zuerst ein Motorrad hinzu, um Ausgaben zu erfassen.",
    "Aggiungi una moto prima di registrare le spese.",
    "Pred beleženjem stroškov dodaj motocikel v garažo."
  ],
  [
    "Ukupno troškova",
    "Total expenses",
    "Ausgaben insgesamt",
    "Spese totali",
    "Skupaj stroškov"
  ],
  [
    "Odaberi kategoriju",
    "Select category",
    "Kategorie auswählen",
    "Seleziona categoria",
    "Izberi kategorijo"
  ],
  [
    "Oprema",
    "Equipment",
    "Ausrüstung",
    "Attrezzatura",
    "Oprema"
  ],
  [
    "Opis servisa",
    "Service description",
    "Wartungsbeschreibung",
    "Descrizione manutenzione",
    "Opis servisa"
  ],
  [
    "Nema evidentiranih troškova",
    "No expenses recorded",
    "Keine Ausgaben erfasst",
    "Nessuna spesa registrata",
    "Ni zabeleženih stroškov"
  ],
  [
    "Dodaj prvi trošak kako bi mogao pratiti koliko ulažeš u svoje motocikle.",
    "Add your first expense to track motorcycle spending.",
    "Erfasse die erste Ausgabe, um deine Motorradkosten zu verfolgen.",
    "Aggiungi la prima spesa per monitorare i costi delle tue moto.",
    "Dodaj prvi strošek za spremljanje izdatkov za motocikle."
  ],
  [
    "+ Dodaj prvi trošak",
    "+ Add first expense",
    "+ Erste Ausgabe hinzufügen",
    "+ Aggiungi prima spesa",
    "+ Dodaj prvi strošek"
  ],
  [
    "Dodaj i upravljaj svojim motociklima na jednom mjestu.",
    "Add and manage all your motorcycles in one place.",
    "Füge deine Motorräder hinzu und verwalte sie an einem Ort.",
    "Aggiungi e gestisci le tue moto in un unico posto.",
    "Dodajaj in upravljaj motocikle na enem mestu."
  ],
  [
    "Unesi osnovne podatke i odaberi fotografiju svog motocikla.",
    "Enter the basic details and choose a motorcycle photo.",
    "Gib die Grunddaten ein und wähle ein Motorradfoto.",
    "Inserisci i dati principali e scegli una foto della moto.",
    "Vnesi osnovne podatke in izberi fotografijo motocikla."
  ],
  [
    "Fotografija motocikla (nije obavezna)",
    "Motorcycle photo (optional)",
    "Motorradfoto (optional)",
    "Foto della moto (facoltativa)",
    "Fotografija motocikla (neobvezno)"
  ],
  [
    "Odaberi fotografiju do 8 MB.",
    "Choose a photo up to 8 MB.",
    "Wähle ein Foto bis 8 MB.",
    "Scegli una foto fino a 8 MB.",
    "Izberi fotografijo do 8 MB."
  ]
]
const finalUiRows = [["Fotografije motocikala", "Motorcycle photos", "Motorradfotos", "Foto delle moto", "Fotografije motociklov"], ["Stavke goriva i servisa iz Troškova izostavljene su kada postoje zasebne evidencije tih kategorija.", "Fuel and service expense entries are excluded when separate records exist for those categories.", "Kraftstoff- und Wartungsausgaben werden ausgelassen, wenn separate Einträge vorhanden sind.", "Le spese per carburante e manutenzione sono escluse quando esistono registrazioni separate.", "Postavke goriva in servisov med stroški niso upoštevane, kadar obstajajo ločene evidence."], ["Trošak po kilometru računa se prema razlici trenutačne i početne kilometraže evidencije. Za postojeće motocikle unesi početnu kilometražu u detaljima. Ne uključuje kupovnu cijenu motocikla.", "Cost per kilometre is calculated from the current mileage minus the starting recorded mileage. Enter the starting mileage in motorcycle details. Purchase price is excluded.", "Die Kosten pro Kilometer ergeben sich aus dem aktuellen Kilometerstand abzüglich des Anfangsstands. Trage den Anfangsstand in den Motorraddetails ein. Der Kaufpreis ist nicht enthalten.", "Il costo al chilometro si basa sulla differenza tra chilometraggio attuale e iniziale. Inserisci quello iniziale nei dettagli della moto. Il prezzo d'acquisto è escluso.", "Strošek na kilometer temelji na razliki med trenutno in začetno kilometrino. Začetno kilometrino vnesi v podrobnostih motocikla. Nakupna cena ni vključena."], ["Trošak vlasništva", "Ownership cost", "Betriebskosten", "Costo di possesso", "Strošek lastništva"], ["Važni rokovi", "Important deadlines", "Wichtige Fristen", "Scadenze importanti", "Pomembni roki"], ["Graf potrošnje goriva", "Fuel consumption chart", "Kraftstoffverbrauchsdiagramm", "Grafico consumi carburante", "Graf porabe goriva"], ["Izračunava se automatski", "Calculated automatically", "Automatisch berechnet", "Calcolato automaticamente", "Izračuna se samodejno"], ["MOJ MOTOCIKL", "MY MOTORCYCLE", "MEIN MOTORRAD", "LA MIA MOTO", "MOJ MOTOCIKEL"], ["Pregled fotografije motocikla", "Motorcycle photo preview", "Vorschau des Motorradfotos", "Anteprima foto moto", "Predogled fotografije motocikla"], ["MOTOCIKL", "MOTORCYCLE", "MOTORRAD", "MOTO", "MOTOCIKEL"], ["PODACI", "DETAILS", "DATEN", "DATI", "PODATKI"], ["TROŠKOVI", "EXPENSES", "AUSGABEN", "SPESE", "STROŠKI"], ["Nema podataka za odabrani motocikl.", "No data for the selected motorcycle.", "Keine Daten für das ausgewählte Motorrad.", "Nessun dato per la moto selezionata.", "Ni podatkov za izbrani motocikel."], ["Za graf su potrebna najmanje dva usporediva točenja.", "At least two comparable refuellings are needed for the chart.", "Für das Diagramm sind mindestens zwei vergleichbare Tankvorgänge nötig.", "Servono almeno due rifornimenti confrontabili per il grafico.", "Za graf sta potrebni vsaj dve primerljivi točenji."], ["Odabir prijave ili registracije", "Choose sign in or registration", "Anmeldung oder Registrierung wählen", "Scegli accesso o registrazione", "Izbira prijave ali registracije"], ["Unesi e-mail adresu", "Enter email address", "E-Mail-Adresse eingeben", "Inserisci l'indirizzo email", "Vnesi e-poštni naslov"], ["Unesi svoje ime", "Enter your name", "Gib deinen Namen ein", "Inserisci il tuo nome", "Vnesi svoje ime"], ["ZA MOTOCIKLE", "FOR MOTORCYCLES", "FÜR MOTORRÄDER", "PER MOTO", "ZA MOTOCIKLE"], ["ili", "or", "oder", "oppure", "ali"], ["Napredna statistika motocikala", "Advanced motorcycle statistics", "Erweiterte Motorradstatistik", "Statistiche avanzate moto", "Napredna statistika motociklov"], ["Broj stavki", "Number of entries", "Anzahl der Einträge", "Numero di voci", "Število postavk"], ["Troškovi po kategorijama", "Expenses by category", "Ausgaben nach Kategorie", "Spese per categoria", "Stroški po kategorijah"], ["Popis stavki", "List of entries", "Liste der Einträge", "Elenco delle voci", "Seznam postavk"], ["Opis / kategorija", "Description / category", "Beschreibung / Kategorie", "Descrizione / categoria", "Opis / kategorija"], ["Izrađeno:", "Created:", "Erstellt:", "Creato:", "Ustvarjeno:"], ["Izvještaj sadrži podatke evidentirane u aplikaciji. Kupovna cijena motocikla nije uključena.", "This report contains data recorded in the application. Motorcycle purchase price is excluded.", "Dieser Bericht enthält in der App erfasste Daten. Der Kaufpreis des Motorrads ist nicht enthalten.", "Questo rapporto contiene i dati registrati nell'app. Il prezzo d'acquisto della moto è escluso.", "Poročilo vsebuje podatke iz aplikacije. Nakupna cena motocikla ni vključena."], ["Prijavi se i nastavi upravljati svojom garažom.", "Sign in to manage your garage.", "Melde dich an, um deine Garage zu verwalten.", "Accedi per gestire il tuo garage.", "Prijavi se za upravljanje garaže."], ["Registriraj se i stvori svoju virtualnu garažu.", "Register and create your virtual garage.", "Registriere dich und erstelle deine virtuelle Garage.", "Registrati e crea il tuo garage virtuale.", "Registriraj se in ustvari svojo virtualno garažo."], ["Izradi korisnički račun", "Create an account", "Konto erstellen", "Crea un account", "Ustvari račun"], ["Dobrodošao natrag", "Welcome back", "Willkommen zurück", "Bentornato", "Dobrodošel nazaj"], ["Uredi servis", "Edit service", "Wartung bearbeiten", "Modifica manutenzione", "Uredi servis"], ["Promijeni podatke o servisu.", "Update service details.", "Wartungsdaten ändern.", "Modifica i dati della manutenzione.", "Spremeni podatke o servisu."], ["Uredi podsjetnik", "Edit reminder", "Erinnerung bearbeiten", "Modifica promemoria", "Uredi opomnik"], ["Uredi trošak", "Edit expense", "Ausgabe bearbeiten", "Modifica spesa", "Uredi strošek"], ["Uredi točenje", "Edit refuelling", "Tankvorgang bearbeiten", "Modifica rifornimento", "Uredi točenje"], ["npr. 150", "e.g. 150", "z. B. 150", "es. 150", "npr. 150"], ["npr. 25000", "e.g. 25000", "z. B. 25000", "es. 25000", "npr. 25000"], ["npr. 26500", "e.g. 26500", "z. B. 26500", "es. 26500", "npr. 26500"], ["npr. 14.5", "e.g. 14.5", "z. B. 14.5", "es. 14.5", "npr. 14.5"], ["npr. 1.52", "e.g. 1.52", "z. B. 1.52", "es. 1.52", "npr. 1.52"], ["npr. 2022", "e.g. 2022", "z. B. 2022", "es. 2022", "npr. 2022"], ["npr. 24000", "e.g. 24000", "z. B. 24000", "es. 24000", "npr. 24000"], ["npr. Suzuki", "e.g. Suzuki", "z. B. Suzuki", "es. Suzuki", "npr. Suzuki"], ["npr. INA, Petrol, Tifon", "e.g. INA, Petrol, Tifon", "z. B. INA, Petrol, Tifon", "es. INA, Petrol, Tifon", "npr. INA, Petrol, Tifon"], ["npr. Zamjena ulja i filtera", "e.g. Oil and filter change", "z. B. Öl- und Filterwechsel", "es. Cambio olio e filtro", "npr. Menjava olja in filtra"], ["npr. Zamjena prednjih guma", "e.g. Front tyre replacement", "z. B. Vorderreifenwechsel", "es. Sostituzione pneumatici anteriori", "npr. Menjava sprednjih pnevmatik"], ["npr. Godišnji servis", "e.g. Annual service", "z. B. Jahreswartung", "es. Manutenzione annuale", "npr. Letni servis"], ["npr. GSX-R 1300 Hayabusa", "e.g. GSX-R 1300 Hayabusa", "z. B. GSX-R 1300 Hayabusa", "es. GSX-R 1300 Hayabusa", "npr. GSX-R 1300 Hayabusa"]]
const dynamicUiRows = [["Servis", "Service", "Wartung", "Manutenzione", "Servis"], ["od", "of", "von", "di", "od"], ["troškova", "expenses", "Ausgaben", "spese", "stroškov"], ["Zatvori", "Close", "Schließen", "Chiudi", "Zapri"], ["+ Dodaj točenje", "+ Add refuelling", "+ Tankvorgang hinzufügen", "+ Aggiungi rifornimento", "+ Dodaj točenje"], ["+ Dodaj servis", "+ Add service", "+ Wartung hinzufügen", "+ Aggiungi manutenzione", "+ Dodaj servis"], ["+ Dodaj podsjetnik", "+ Add reminder", "+ Erinnerung hinzufügen", "+ Aggiungi promemoria", "+ Dodaj opomnik"], ["+ Dodaj trošak", "+ Add expense", "+ Ausgabe hinzufügen", "+ Aggiungi spesa", "+ Dodaj strošek"], ["+ Dodaj motocikl", "+ Add motorcycle", "+ Motorrad hinzufügen", "+ Aggiungi moto", "+ Dodaj motocikel"], ["Spremi promjene", "Save changes", "Änderungen speichern", "Salva modifiche", "Shrani spremembe"], ["Spremi točenje", "Save refuelling", "Tankvorgang speichern", "Salva rifornimento", "Shrani točenje"], ["Spremi podsjetnik", "Save reminder", "Erinnerung speichern", "Salva promemoria", "Shrani opomnik"], ["Spremi trošak", "Save expense", "Ausgabe speichern", "Salva spesa", "Shrani strošek"], ["Spremi motocikl", "Save motorcycle", "Motorrad speichern", "Salva moto", "Shrani motocikel"], ["Spremanje...", "Saving...", "Speichern...", "Salvataggio...", "Shranjevanje..."], ["Izvoz...", "Exporting...", "Exportieren...", "Esportazione...", "Izvažanje..."], ["Dodaj fotografiju", "Add photo", "Foto hinzufügen", "Aggiungi foto", "Dodaj fotografijo"], ["Promijeni fotografiju", "Change photo", "Foto ändern", "Cambia foto", "Spremeni fotografijo"], ["Uredi podatke", "Edit details", "Daten bearbeiten", "Modifica dati", "Uredi podatke"], ["Nije unesena", "Not entered", "Nicht eingegeben", "Non inserita", "Ni vnesena"], ["Datum nije naveden", "Date not provided", "Datum nicht angegeben", "Data non indicata", "Datum ni naveden"], ["Nedovoljno podataka", "Insufficient data", "Nicht genügend Daten", "Dati insufficienti", "Premalo podatkov"], ["Nepoznati motocikl", "Unknown motorcycle", "Unbekanntes Motorrad", "Moto sconosciuta", "Neznan motocikel"], ["Nije navedeno", "Not specified", "Nicht angegeben", "Non specificato", "Ni navedeno"], ["Uredi točenje goriva", "Edit refuelling", "Tankvorgang bearbeiten", "Modifica rifornimento", "Uredi točenje goriva"], ["Dodaj točenje goriva", "Add refuelling", "Tankvorgang hinzufügen", "Aggiungi rifornimento", "Dodaj točenje goriva"], ["Promijeni podatke o točenju goriva.", "Update refuelling details.", "Tankdaten ändern.", "Modifica i dati del rifornimento.", "Spremeni podatke o točenju goriva."], ["Unesi podatke o točenju goriva.", "Enter refuelling details.", "Tankdaten eingeben.", "Inserisci i dati del rifornimento.", "Vnesi podatke o točenju goriva."], ["Promijeni podatke o podsjetniku.", "Update reminder details.", "Erinnerungsdaten ändern.", "Modifica i dati del promemoria.", "Spremeni podatke o opomniku."], ["Unesi podatke o novom podsjetniku.", "Enter new reminder details.", "Daten zur neuen Erinnerung eingeben.", "Inserisci i dati del nuovo promemoria.", "Vnesi podatke o novem opomniku."], ["Promijeni podatke o trošku.", "Update expense details.", "Ausgabendaten ändern.", "Modifica i dati della spesa.", "Spremeni podatke o strošku."], ["Unesi podatke o novom trošku.", "Enter new expense details.", "Daten zur neuen Ausgabe eingeben.", "Inserisci i dati della nuova spesa.", "Vnesi podatke o novem strošku."], ["Ukupni evidentirani troškovi po mjesecima, do 12 posljednjih mjeseci s unosima.", "Recorded monthly expenses, up to the last 12 months with entries.", "Erfasste monatliche Ausgaben der letzten bis zu 12 Monate mit Einträgen.", "Spese mensili registrate, fino agli ultimi 12 mesi con voci.", "Zabeleženi mesečni stroški za do 12 zadnjih mesecev z vnosi."], ["Procjena L/100 km između uzastopnih unosa kilometraže za isti motocikl. Za usporedbu odaberi jedan motocikl.", "Estimated L/100 km between consecutive mileage entries for the same motorcycle. Select one motorcycle to compare.", "Geschätzte L/100 km zwischen aufeinanderfolgenden Kilometerständen desselben Motorrads. Wähle ein Motorrad zum Vergleich.", "Stima L/100 km tra rilevazioni consecutive per la stessa moto. Seleziona una moto per il confronto.", "Ocena L/100 km med zaporednimi vnosi kilometrine istega motocikla. Za primerjavo izberi motocikel."], ["Sakrij lozinku", "Hide password", "Passwort ausblenden", "Nascondi password", "Skrij geslo"], ["Prikaži lozinku", "Show password", "Passwort anzeigen", "Mostra password", "Prikaži geslo"], ["Sakrij", "Hide", "Ausblenden", "Nascondi", "Skrij"], ["Prikaži", "Show", "Anzeigen", "Mostra", "Prikaži"], ["Registriraj se", "Register", "Registrieren", "Registrati", "Registriraj se"], ["Prijavi se", "Sign in", "Anmelden", "Accedi", "Prijavi se"], ["Već imaš korisnički račun?", "Already have an account?", "Hast du bereits ein Konto?", "Hai già un account?", "Že imaš račun?"], ["Nemaš korisnički račun?", "Don't have an account?", "Noch kein Konto?", "Non hai un account?", "Nimaš računa?"], ["Najmanje 8 znakova", "At least 8 characters", "Mindestens 8 Zeichen", "Almeno 8 caratteri", "Najmanj 8 znakov"], ["Unesi lozinku", "Enter password", "Passwort eingeben", "Inserisci password", "Vnesi geslo"], ["nepoznatog datuma", "unknown date", "unbekanntes Datum", "data sconosciuta", "neznan datum"]]
const validationUiRows = [["Nepoznat rok", "Unknown deadline", "Unbekannte Frist", "Scadenza sconosciuta", "Neznan rok"], ["Provjeri datum", "Check date", "Datum prüfen", "Controlla la data", "Preveri datum"], ["Istekao", "Expired", "Abgelaufen", "Scaduto", "Potekel"], ["Danas", "Today", "Heute", "Oggi", "Danes"], ["Rok je danas", "Due today", "Heute fällig", "Scade oggi", "Rok je danes"], ["Aktivan", "Active", "Aktiv", "Attivo", "Aktiven"], ["Odabrana datoteka mora biti fotografija.", "Selected file must be an image.", "Die ausgewählte Datei muss ein Bild sein.", "Il file selezionato deve essere un'immagine.", "Izbrana datoteka mora biti slika."], ["Fotografija ne smije biti veća od 8 MB.", "Photo must not exceed 8 MB.", "Das Foto darf nicht größer als 8 MB sein.", "La foto non deve superare 8 MB.", "Fotografija ne sme presegati 8 MB."], ["Molimo ispuni sva obavezna polja.", "Please fill in all required fields.", "Bitte alle Pflichtfelder ausfüllen.", "Compila tutti i campi obbligatori.", "Izpolni vsa obvezna polja."], ["Početna kilometraža mora biti između 0 i trenutačne kilometraže.", "Starting mileage must be between zero and current mileage.", "Der Anfangskilometerstand muss zwischen null und dem aktuellen Stand liegen.", "Il chilometraggio iniziale deve essere compreso tra zero e quello attuale.", "Začetna kilometrina mora biti med nič in trenutno kilometrino."], ["Motocikl nije bilo moguće spremiti. Provjeri podatke i pokušaj ponovno.", "Could not save motorcycle. Check the details and try again.", "Motorrad konnte nicht gespeichert werden. Prüfe die Daten und versuche es erneut.", "Impossibile salvare la moto. Controlla i dati e riprova.", "Motocikla ni bilo mogoče shraniti. Preveri podatke in poskusi znova."], ["Količina goriva mora biti veća od 0.", "Fuel quantity must be greater than zero.", "Die Kraftstoffmenge muss größer als null sein.", "La quantità di carburante deve essere maggiore di zero.", "Količina goriva mora biti večja od nič."], ["Cijena po litri mora biti veća od 0.", "Price per litre must be greater than zero.", "Der Preis pro Liter muss größer als null sein.", "Il prezzo al litro deve essere maggiore di zero.", "Cena na liter mora biti večja od nič."], ["Odabrani datum nije ispravan.", "Selected date is invalid.", "Das ausgewählte Datum ist ungültig.", "La data selezionata non è valida.", "Izbrani datum ni veljaven."], ["Datum servisa ne može biti u budućnosti.", "Service date cannot be in the future.", "Das Wartungsdatum darf nicht in der Zukunft liegen.", "La data della manutenzione non può essere futura.", "Datum servisa ne sme biti v prihodnosti."]]
const authUiRows = [["Lozinka mora imati najmanje 8 znakova.", "Password must be at least 8 characters.", "Das Passwort muss mindestens 8 Zeichen lang sein.", "La password deve contenere almeno 8 caratteri.", "Geslo mora imeti najmanj 8 znakov."], ["Ime mora imati najmanje 2 znaka.", "Name must be at least 2 characters.", "Der Name muss mindestens 2 Zeichen lang sein.", "Il nome deve contenere almeno 2 caratteri.", "Ime mora imeti najmanj 2 znaka."], ["Unesi ispravnu e-mail adresu.", "Enter a valid email address.", "Gib eine gültige E-Mail-Adresse ein.", "Inserisci un indirizzo email valido.", "Vnesi veljaven e-poštni naslov."], ["Korisnik s ovom e-mail adresom već postoji.", "An account with this email already exists.", "Ein Konto mit dieser E-Mail-Adresse existiert bereits.", "Esiste già un account con questa email.", "Račun s tem e-poštnim naslovom že obstaja."], ["Neispravni podaci za prijavu.", "Invalid sign-in details.", "Ungültige Anmeldedaten.", "Dati di accesso non validi.", "Neveljavni podatki za prijavo."], ["Neispravna e-mail adresa ili lozinka.", "Invalid email address or password.", "Ungültige E-Mail-Adresse oder Passwort.", "Email o password non validi.", "Neveljaven e-poštni naslov ali geslo."], ["Dogodila se pogreška. Pokušaj ponovno.", "An error occurred. Please try again.", "Ein Fehler ist aufgetreten. Bitte versuche es erneut.", "Si è verificato un errore. Riprova.", "Prišlo je do napake. Poskusi znova."]]
const pdfUiRows = [["Izvještaj o troškovima", "Expense report", "Ausgabenbericht", "Rapporto spese", "Poročilo o stroških"], ["Izvještaj:", "Report:", "Bericht:", "Rapporto:", "Poročilo:"], ["Godina:", "Year:", "Baujahr:", "Anno:", "Leto:"], ["Gorivo:", "Fuel:", "Kraftstoff:", "Carburante:", "Gorivo:"], ["Od", "From", "Von", "Da", "Od"], ["Do", "To", "Bis", "A", "Do"], ["Bez ograničenja", "No limit", "Keine Einschränkung", "Nessun limite", "Brez omejitve"], ["Trenutačna kilometraža", "Current mileage", "Aktueller Kilometerstand", "Chilometraggio attuale", "Trenutna kilometrina"], ["Prijeđeno od početka evidencije", "Distance since tracking began", "Strecke seit Beginn der Aufzeichnung", "Distanza dall'inizio del monitoraggio", "Prevoženo od začetka evidence"], ["Izvještaj nije moguće izvesti. Pokušaj ponovno.", "Could not export the report. Please try again.", "Der Bericht konnte nicht exportiert werden. Bitte versuche es erneut.", "Impossibile esportare il rapporto. Riprova.", "Poročila ni bilo mogoče izvoziti. Poskusi znova."]]
const maintenanceUiRows = [
['Plan održavanja','Maintenance plan','Wartungsplan','Piano di manutenzione','Načrt vzdrževanja'],
['Prati sljedeće servise prema kilometraži i datumu.','Track upcoming maintenance by mileage and date.','Verfolge kommende Wartungen nach Kilometerstand und Datum.','Monitora la manutenzione in base ai chilometri e alla data.','Spremljaj prihodnje servise po kilometrini in datumu.'],
['+ Dodaj plan','+ Add plan','+ Plan hinzufügen','+ Aggiungi piano','+ Dodaj načrt'],
['Vrsta održavanja','Maintenance type','Wartungsart','Tipo di manutenzione','Vrsta vzdrževanja'],
['Naziv zahvata','Maintenance task','Wartungsaufgabe','Intervento','Vzdrževalno opravilo'],
['Zadnja kilometraža','Last mileage','Letzter Kilometerstand','Ultimo chilometraggio','Zadnja kilometrina'],
['Datum zadnjeg održavanja','Last maintenance date','Letztes Wartungsdatum','Data ultima manutenzione','Datum zadnjega vzdrževanja'],
['Interval (km)','Interval (km)','Intervall (km)','Intervallo (km)','Interval (km)'],
['Interval (mjeseci)','Interval (months)','Intervall (Monate)','Intervallo (mesi)','Interval (meseci)'],
['Spremi plan','Save plan','Plan speichern','Salva piano','Shrani načrt'],
['Filtriraj po motociklu','Filter by motorcycle','Nach Motorrad filtern','Filtra per moto','Filtriraj po motociklu'],
['planova','plans','Pläne','piani','načrtov'],
['Nema evidentiranih planova održavanja.','No maintenance plans recorded.','Keine Wartungspläne erfasst.','Nessun piano di manutenzione registrato.','Ni evidentiranih načrtov vzdrževanja.'],
['Sljedeća kilometraža','Next mileage','Nächster Kilometerstand','Prossimo chilometraggio','Naslednja kilometrina'],
['Preostalo kilometara','Kilometres remaining','Verbleibende Kilometer','Chilometri rimanenti','Preostali kilometri'],
['Sljedeći datum','Next date','Nächstes Datum','Prossima data','Naslednji datum'],
['Uskoro dospijeva','Due soon','Bald fällig','In scadenza','Kmalu zapade'],
['Prekoračeno','Overdue','Überfällig','Scaduto','Prekoračeno'],
['Uredno','On track','Im Plan','In regola','Urejeno'],
['Podsjetnik dodan','Reminder added','Erinnerung hinzugefügt','Promemoria aggiunto','Opomnik dodan'],
['Planirano održavanje','Scheduled maintenance','Geplante Wartung','Manutenzione programmata','Načrtovano vzdrževanje'],
['Obrisati plan održavanja?','Delete maintenance plan?','Wartungsplan löschen?','Eliminare il piano di manutenzione?','Izbrisati načrt vzdrževanja?'],
['Unesi ispravne podatke i barem jedan interval održavanja.','Enter valid details and at least one maintenance interval.','Gib gültige Daten und mindestens ein Wartungsintervall ein.','Inserisci dati validi e almeno un intervallo.','Vnesi veljavne podatke in vsaj en interval.'],
['Zamjena ulja','Oil change','Ölwechsel','Cambio olio','Menjava olja'],
['Filteri','Filters','Filter','Filtri','Filtri'],
['Kočnice','Brakes','Bremsen','Freni','Zavore'],
['Gume','Tyres','Reifen','Pneumatici','Pnevmatike'],
['Lanac','Chain','Kette','Catena','Veriga'],
['Ostalo','Other','Sonstiges','Altro','Drugo']
]
export const translations = Object.fromEntries([...rows, ...additionalRows, ...completeUiRows, ...finalUiRows, ...dynamicUiRows, ...validationUiRows, ...authUiRows, ...pdfUiRows, ...maintenanceUiRows].map(([hr,en,de,it,sl]) => [hr,{hr,en,de,it,sl}]))
export function translate(text, lang) {
  return translations[text]?.[lang] || text
}
