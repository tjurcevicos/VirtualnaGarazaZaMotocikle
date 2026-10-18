export const helpSections = [
  {
    "title": "Početak rada",
    "page": "home",
    "questions": [
      {
        "q": "Kako započeti s aplikacijom?",
        "a": "Prijavi se, otvori Vozila i dodaj prvi motocikl. Nakon toga možeš evidentirati servise, točenja goriva, troškove i podsjetnike. Početna stranica prikazuje sažetak garaže."
      },
      {
        "q": "Gdje se čuvaju podaci?",
        "a": "Podaci se spremaju lokalno u pregledniku za korisnički račun. Redovito izvezi sigurnosnu kopiju u Postavkama, osobito prije brisanja podataka preglednika ili promjene računala."
      }
    ]
  },
  {
    "title": "Vozila",
    "page": "vozila",
    "questions": [
      {
        "q": "Kako dodati ili urediti motocikl?",
        "a": "Otvori Vozila i odaberi dodavanje motocikla. Unesi marku, model i ostale podatke. Za uređivanje otvori detalje postojećeg motocikla."
      },
      {
        "q": "Zašto je važna početna kilometraža?",
        "a": "Početna kilometraža evidencije služi za računanje prijeđene udaljenosti i troška po kilometru. Postavi je u detaljima motocikla, a trenutačnu kilometražu redovito ažuriraj."
      },
      {
        "q": "Kako dodati fotografiju?",
        "a": "Otvori detalje motocikla i koristi mogućnost dodavanja fotografije. Fotografije su povezane s odabranim motociklom."
      },
      {
        "q": "Što se događa pri brisanju motocikla?",
        "a": "Brisanje motocikla može ukloniti i povezane zapise. Prije brisanja izradi sigurnosnu kopiju."
      }
    ]
  },
  {
    "title": "Servisi i održavanje",
    "page": "servisi",
    "questions": [
      {
        "q": "Kako evidentirati servis?",
        "a": "Na stranici Servisi odaberi motocikl i dodaj servis s datumom, opisom, kilometražom i iznosom. Evidencija služi za praćenje povijesti održavanja."
      },
      {
        "q": "Kako radi plan održavanja?",
        "a": "Za motocikl unesi planirane radove i interval prema datumu ili kilometraži. Planove provjeravaj uz trenutačnu kilometražu; samo stavke s datumom mogu se prikazati u kalendaru."
      },
      {
        "q": "Kako se servis računa u trošak?",
        "a": "Evidentirani iznos servisa ulazi u statistiku vlasništva. Pazi da isti iznos ne evidentiraš dvaput kao zaseban trošak."
      }
    ]
  },
  {
    "title": "Gorivo",
    "page": "gorivo",
    "questions": [
      {
        "q": "Kako dodati točenje goriva?",
        "a": "Na stranici Gorivo odaberi motocikl i upiši datum, količinu goriva, cijenu i kilometražu ako je dostupna. Točenja se koriste za troškove i analizu potrošnje."
      },
      {
        "q": "Zašto potrošnja možda nije prikazana?",
        "a": "Za izračun potrošnje potrebni su odgovarajući zapisi i kilometraža. Ako podaci nedostaju ili nisu dosljedni, izračun može biti nedostupan."
      }
    ]
  },
  {
    "title": "Troškovi",
    "page": "troskovi",
    "questions": [
      {
        "q": "Kako pratiti ostale troškove?",
        "a": "Na stranici Troškovi dodaj iznos, kategoriju, datum i motocikl. Koristi filtre za pregled pojedinog motocikla ili vrste troška."
      },
      {
        "q": "Kako izbjeći dvostruko računanje?",
        "a": "Servise i gorivo najbolje je evidentirati u njihovim posebnim stranicama. Ako isti iznos upišeš i u Troškove, provjeri način na koji statistika grupira evidencije."
      }
    ]
  },
  {
    "title": "Statistika",
    "page": "statistika",
    "questions": [
      {
        "q": "Što prikazuje Statistika?",
        "a": "Prikazuje broj motocikala, ukupne evidentirane troškove, servisne zapise, gorivo, planove održavanja i rokove. Možeš filtrirati rezultate po motociklu."
      },
      {
        "q": "Kako se računa trošak po kilometru?",
        "a": "Trošak po kilometru temelji se na evidentiranim troškovima i razlici između trenutačne i početne kilometraže. Ako početna kilometraža nije unesena ili udaljenost nije pozitivna, vrijednost možda neće biti dostupna."
      },
      {
        "q": "Jesu li podaci ažurni?",
        "a": "Statistika se izračunava iz postojećih evidencija. Nakon izmjene zapisa ili motocikla rezultati se ažuriraju."
      }
    ]
  },
  {
    "title": "Podsjetnici",
    "page": "podsjetnici",
    "questions": [
      {
        "q": "Kako postaviti podsjetnik?",
        "a": "Otvori Podsjetnici i unesi novi podsjetnik s datumom i motociklom. Prati nadolazeće i istekle obveze te označi završene zadatke."
      },
      {
        "q": "Prikazuju li se podsjetnici u kalendaru?",
        "a": "Podsjetnici s valjanim datumom mogu se prikazati u kalendaru. Kalendar preuzima postojeće zapise, bez ponovnog unosa."
      }
    ]
  },
  {
    "title": "Kalendar",
    "page": "kalendar",
    "questions": [
      {
        "q": "Kako koristiti kalendar?",
        "a": "Prelazi između mjeseci, odaberi dan i pregledaj događaje. Filtriraj događaje prema motociklu ili vrsti, a zatim otvori povezanu stranicu."
      },
      {
        "q": "Koji se događaji prikazuju?",
        "a": "Kalendar povezuje podsjetnike, servisne datume, planove održavanja s datumom te rokove registracije i osiguranja. Planovi određeni samo kilometražom nemaju kalendarski datum."
      }
    ]
  },
  {
    "title": "Registracija i osiguranje",
    "page": "vozila",
    "questions": [
      {
        "q": "Gdje se unose registracija i osiguranje?",
        "a": "Otvori detalje motocikla i pronađi odjeljak Registracija i osiguranje. Unesi potrebne datume i podatke o dokumentima."
      },
      {
        "q": "Kako pratiti istek rokova?",
        "a": "Datumi isteka prikazuju se u povezanim pregledima, statistici i kalendaru kada su pravilno uneseni. Redovito provjeravaj podatke jer aplikacija nije zamjena za službene obavijesti."
      }
    ]
  },
  {
    "title": "Postavke i sigurnosne kopije",
    "page": "postavke",
    "questions": [
      {
        "q": "Kako promijeniti jezik ili temu?",
        "a": "Otvori Postavke, odaberi jezik ili jednu od šest tema. Promjena teme prilagođava boje aplikacije, a odabrani jezik mijenja dostupne prijevode sučelja."
      },
      {
        "q": "Kako napraviti sigurnosnu kopiju?",
        "a": "U Postavkama koristi izvoz sigurnosne kopije i spremi dobivenu datoteku na sigurno mjesto. Izvoz ponovi nakon važnih promjena."
      },
      {
        "q": "Kako vratiti podatke?",
        "a": "U Postavkama odaberi vraćanje podataka iz ranije spremljene sigurnosne kopije. Prije uvoza provjeri datoteku i po potrebi izvezi postojeće podatke."
      },
      {
        "q": "Čemu služi PDF izvoz?",
        "a": "Na stranicama koje nude PDF izvoz možeš izraditi dokument s podacima za pregled ili ispis."
      }
    ]
  }
]
