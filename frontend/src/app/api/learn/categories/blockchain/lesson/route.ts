import { NextResponse } from "next/server"
import { Lesson } from "@/types/Lesson"

export async function GET(): Promise<NextResponse<Lesson>> {
  // Simuler un délai d'API
  await new Promise((resolve) => setTimeout(resolve, 100))

  return NextResponse.json({
    id: 1,
    title: "⛓️📦 La blockchain expliquée simplement",
    subtitle: "Comprendre la technologie derrière les cryptomonnaies",
    content:
      "<p>Imaginez un grand livre de comptes partagé par des milliers de personnes à travers le monde, où chaque transaction est inscrite de manière permanente et visible par tous. C'est essentiellement ce qu'est la blockchain : une base de données distribuée qui enregistre des informations de façon transparente et sécurisée, sans avoir besoin d'un intermédiaire comme une banque ou une institution centrale. Contrairement à un système traditionnel où une seule entité contrôle les données, la blockchain repose sur un réseau de participants qui vérifient et valident ensemble chaque nouvelle information ajoutée.</p>\n\n<p>Le nom \"blockchain\" vient de sa structure particulière : les données sont regroupées en blocs qui s'enchaînent les uns aux autres comme les maillons d'une chaîne. Chaque bloc contient un ensemble de transactions, l'heure à laquelle il a été créé, et une empreinte numérique unique (appelée hash) qui le relie au bloc précédent. Cette organisation rend pratiquement impossible la modification des informations passées, car changer un seul bloc nécessiterait de modifier tous les blocs suivants, ce que le réseau détecterait immédiatement.</p>\n\n<p>Pour garantir la sécurité et la fiabilité du système, la blockchain utilise un mécanisme de validation appelé consensus. Avant qu'un nouveau bloc soit ajouté à la chaîne, un réseau d'ordinateurs (appelés nœuds ou mineurs) doit s'accorder sur sa validité. Ces participants vérifient que les transactions sont légitimes et qu'aucune fraude n'est tentée, comme essayer de dépenser deux fois le même argent. Une fois validé par la majorité du réseau, le bloc est ajouté définitivement à la chaîne et devient accessible à tous les participants.</p>\n\n<p>Au-delà des cryptomonnaies comme le Bitcoin qui ont popularisé cette technologie, la blockchain trouve aujourd'hui des applications dans de nombreux domaines : traçabilité des produits alimentaires, certification de documents officiels, gestion des droits d'auteur, ou encore vote électronique. Son principal avantage réside dans sa capacité à créer de la confiance entre des parties qui ne se connaissent pas, sans dépendre d'une autorité centrale. Bien que la technologie puisse sembler complexe au premier abord, son principe reste simple : permettre à des personnes de collaborer et d'échanger en toute transparence, tout en garantissant que personne ne puisse tricher ou manipuler l'historique des transactions.</p>",
  })
}
