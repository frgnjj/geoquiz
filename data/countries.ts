// The 197 countries in the quiz: the 193 UN members plus Taiwan, Kosovo, Vatican City and Palestine.
// Base data from the world-countries dataset (ODbL), with names, capitals and continents curated for Geoquiz.

export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania";

export const CONTINENTS: Continent[] = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
];

export type Country = {
  /** ISO 3166-1 alpha-2 code, lowercase. Also the flag file name in public/flags. */
  code: string;
  name: string;
  continent: Continent;
  /** Every official capital. Countries with several are shown joined by "/". */
  capitals: string[];
  /** Other accepted names for the country when typing. */
  aliases: string[];
  /** Other accepted spellings of the capital(s) when typing. */
  capitalAliases: string[];
};

export const COUNTRIES: Country[] = [
  {
    "code": "af",
    "name": "Afghanistan",
    "continent": "Asia",
    "capitals": [
      "Kabul"
    ],
    "aliases": [
      "Islamic Republic of Afghanistan"
    ],
    "capitalAliases": []
  },
  {
    "code": "al",
    "name": "Albania",
    "continent": "Europe",
    "capitals": [
      "Tirana"
    ],
    "aliases": [
      "Republic of Albania"
    ],
    "capitalAliases": []
  },
  {
    "code": "dz",
    "name": "Algeria",
    "continent": "Africa",
    "capitals": [
      "Algiers"
    ],
    "aliases": [
      "People's Democratic Republic of Algeria"
    ],
    "capitalAliases": []
  },
  {
    "code": "ad",
    "name": "Andorra",
    "continent": "Europe",
    "capitals": [
      "Andorra la Vella"
    ],
    "aliases": [
      "Principality of Andorra"
    ],
    "capitalAliases": []
  },
  {
    "code": "ao",
    "name": "Angola",
    "continent": "Africa",
    "capitals": [
      "Luanda"
    ],
    "aliases": [
      "Republic of Angola"
    ],
    "capitalAliases": []
  },
  {
    "code": "ag",
    "name": "Antigua and Barbuda",
    "continent": "North America",
    "capitals": [
      "St. John's"
    ],
    "aliases": [],
    "capitalAliases": [
      "Saint John's"
    ]
  },
  {
    "code": "ar",
    "name": "Argentina",
    "continent": "South America",
    "capitals": [
      "Buenos Aires"
    ],
    "aliases": [
      "Argentine Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "am",
    "name": "Armenia",
    "continent": "Asia",
    "capitals": [
      "Yerevan"
    ],
    "aliases": [
      "Republic of Armenia"
    ],
    "capitalAliases": []
  },
  {
    "code": "au",
    "name": "Australia",
    "continent": "Oceania",
    "capitals": [
      "Canberra"
    ],
    "aliases": [
      "Commonwealth of Australia"
    ],
    "capitalAliases": []
  },
  {
    "code": "at",
    "name": "Austria",
    "continent": "Europe",
    "capitals": [
      "Vienna"
    ],
    "aliases": [
      "Republic of Austria"
    ],
    "capitalAliases": []
  },
  {
    "code": "az",
    "name": "Azerbaijan",
    "continent": "Asia",
    "capitals": [
      "Baku"
    ],
    "aliases": [
      "Republic of Azerbaijan"
    ],
    "capitalAliases": []
  },
  {
    "code": "bs",
    "name": "Bahamas",
    "continent": "North America",
    "capitals": [
      "Nassau"
    ],
    "aliases": [
      "The Bahamas",
      "Commonwealth of the Bahamas"
    ],
    "capitalAliases": []
  },
  {
    "code": "bh",
    "name": "Bahrain",
    "continent": "Asia",
    "capitals": [
      "Manama"
    ],
    "aliases": [
      "Kingdom of Bahrain"
    ],
    "capitalAliases": []
  },
  {
    "code": "bd",
    "name": "Bangladesh",
    "continent": "Asia",
    "capitals": [
      "Dhaka"
    ],
    "aliases": [
      "People's Republic of Bangladesh"
    ],
    "capitalAliases": []
  },
  {
    "code": "bb",
    "name": "Barbados",
    "continent": "North America",
    "capitals": [
      "Bridgetown"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "by",
    "name": "Belarus",
    "continent": "Europe",
    "capitals": [
      "Minsk"
    ],
    "aliases": [
      "Republic of Belarus"
    ],
    "capitalAliases": []
  },
  {
    "code": "be",
    "name": "Belgium",
    "continent": "Europe",
    "capitals": [
      "Brussels"
    ],
    "aliases": [
      "Kingdom of Belgium"
    ],
    "capitalAliases": []
  },
  {
    "code": "bz",
    "name": "Belize",
    "continent": "North America",
    "capitals": [
      "Belmopan"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "bj",
    "name": "Benin",
    "continent": "Africa",
    "capitals": [
      "Porto-Novo"
    ],
    "aliases": [
      "Republic of Benin"
    ],
    "capitalAliases": []
  },
  {
    "code": "bt",
    "name": "Bhutan",
    "continent": "Asia",
    "capitals": [
      "Thimphu"
    ],
    "aliases": [
      "Kingdom of Bhutan"
    ],
    "capitalAliases": []
  },
  {
    "code": "bo",
    "name": "Bolivia",
    "continent": "South America",
    "capitals": [
      "La Paz",
      "Sucre"
    ],
    "aliases": [
      "Plurinational State of Bolivia"
    ],
    "capitalAliases": []
  },
  {
    "code": "ba",
    "name": "Bosnia and Herzegovina",
    "continent": "Europe",
    "capitals": [
      "Sarajevo"
    ],
    "aliases": [
      "Bosnia"
    ],
    "capitalAliases": []
  },
  {
    "code": "bw",
    "name": "Botswana",
    "continent": "Africa",
    "capitals": [
      "Gaborone"
    ],
    "aliases": [
      "Republic of Botswana"
    ],
    "capitalAliases": []
  },
  {
    "code": "br",
    "name": "Brazil",
    "continent": "South America",
    "capitals": [
      "Brasília"
    ],
    "aliases": [
      "Federative Republic of Brazil"
    ],
    "capitalAliases": []
  },
  {
    "code": "bn",
    "name": "Brunei",
    "continent": "Asia",
    "capitals": [
      "Bandar Seri Begawan"
    ],
    "aliases": [
      "Nation of Brunei, Abode of Peace"
    ],
    "capitalAliases": []
  },
  {
    "code": "bg",
    "name": "Bulgaria",
    "continent": "Europe",
    "capitals": [
      "Sofia"
    ],
    "aliases": [
      "Republic of Bulgaria"
    ],
    "capitalAliases": []
  },
  {
    "code": "bf",
    "name": "Burkina Faso",
    "continent": "Africa",
    "capitals": [
      "Ouagadougou"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "bi",
    "name": "Burundi",
    "continent": "Africa",
    "capitals": [
      "Gitega"
    ],
    "aliases": [
      "Republic of Burundi"
    ],
    "capitalAliases": []
  },
  {
    "code": "kh",
    "name": "Cambodia",
    "continent": "Asia",
    "capitals": [
      "Phnom Penh"
    ],
    "aliases": [
      "Kingdom of Cambodia"
    ],
    "capitalAliases": []
  },
  {
    "code": "cm",
    "name": "Cameroon",
    "continent": "Africa",
    "capitals": [
      "Yaoundé"
    ],
    "aliases": [
      "Republic of Cameroon"
    ],
    "capitalAliases": []
  },
  {
    "code": "ca",
    "name": "Canada",
    "continent": "North America",
    "capitals": [
      "Ottawa"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "cv",
    "name": "Cape Verde",
    "continent": "Africa",
    "capitals": [
      "Praia"
    ],
    "aliases": [
      "Cabo Verde",
      "Republic of Cabo Verde"
    ],
    "capitalAliases": []
  },
  {
    "code": "cf",
    "name": "Central African Republic",
    "continent": "Africa",
    "capitals": [
      "Bangui"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "td",
    "name": "Chad",
    "continent": "Africa",
    "capitals": [
      "N'Djamena"
    ],
    "aliases": [
      "Republic of Chad"
    ],
    "capitalAliases": []
  },
  {
    "code": "cl",
    "name": "Chile",
    "continent": "South America",
    "capitals": [
      "Santiago"
    ],
    "aliases": [
      "Republic of Chile"
    ],
    "capitalAliases": []
  },
  {
    "code": "cn",
    "name": "China",
    "continent": "Asia",
    "capitals": [
      "Beijing"
    ],
    "aliases": [
      "People's Republic of China"
    ],
    "capitalAliases": []
  },
  {
    "code": "co",
    "name": "Colombia",
    "continent": "South America",
    "capitals": [
      "Bogotá"
    ],
    "aliases": [
      "Republic of Colombia"
    ],
    "capitalAliases": []
  },
  {
    "code": "km",
    "name": "Comoros",
    "continent": "Africa",
    "capitals": [
      "Moroni"
    ],
    "aliases": [
      "Union of the Comoros"
    ],
    "capitalAliases": []
  },
  {
    "code": "cr",
    "name": "Costa Rica",
    "continent": "North America",
    "capitals": [
      "San José"
    ],
    "aliases": [
      "Republic of Costa Rica"
    ],
    "capitalAliases": []
  },
  {
    "code": "hr",
    "name": "Croatia",
    "continent": "Europe",
    "capitals": [
      "Zagreb"
    ],
    "aliases": [
      "Republic of Croatia"
    ],
    "capitalAliases": []
  },
  {
    "code": "cu",
    "name": "Cuba",
    "continent": "North America",
    "capitals": [
      "Havana"
    ],
    "aliases": [
      "Republic of Cuba"
    ],
    "capitalAliases": []
  },
  {
    "code": "cy",
    "name": "Cyprus",
    "continent": "Asia",
    "capitals": [
      "Nicosia"
    ],
    "aliases": [
      "Republic of Cyprus"
    ],
    "capitalAliases": []
  },
  {
    "code": "cz",
    "name": "Czechia",
    "continent": "Europe",
    "capitals": [
      "Prague"
    ],
    "aliases": [
      "Czech Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "dk",
    "name": "Denmark",
    "continent": "Europe",
    "capitals": [
      "Copenhagen"
    ],
    "aliases": [
      "Kingdom of Denmark"
    ],
    "capitalAliases": []
  },
  {
    "code": "dj",
    "name": "Djibouti",
    "continent": "Africa",
    "capitals": [
      "Djibouti"
    ],
    "aliases": [
      "Republic of Djibouti"
    ],
    "capitalAliases": []
  },
  {
    "code": "dm",
    "name": "Dominica",
    "continent": "North America",
    "capitals": [
      "Roseau"
    ],
    "aliases": [
      "Commonwealth of Dominica"
    ],
    "capitalAliases": []
  },
  {
    "code": "do",
    "name": "Dominican Republic",
    "continent": "North America",
    "capitals": [
      "Santo Domingo"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "cd",
    "name": "DR Congo",
    "continent": "Africa",
    "capitals": [
      "Kinshasa"
    ],
    "aliases": [
      "Democratic Republic of the Congo",
      "DRC",
      "Congo-Kinshasa",
      "Congo Kinshasa"
    ],
    "capitalAliases": []
  },
  {
    "code": "ec",
    "name": "Ecuador",
    "continent": "South America",
    "capitals": [
      "Quito"
    ],
    "aliases": [
      "Republic of Ecuador"
    ],
    "capitalAliases": []
  },
  {
    "code": "eg",
    "name": "Egypt",
    "continent": "Africa",
    "capitals": [
      "Cairo"
    ],
    "aliases": [
      "Arab Republic of Egypt"
    ],
    "capitalAliases": []
  },
  {
    "code": "sv",
    "name": "El Salvador",
    "continent": "North America",
    "capitals": [
      "San Salvador"
    ],
    "aliases": [
      "Republic of El Salvador"
    ],
    "capitalAliases": []
  },
  {
    "code": "gq",
    "name": "Equatorial Guinea",
    "continent": "Africa",
    "capitals": [
      "Malabo"
    ],
    "aliases": [
      "Republic of Equatorial Guinea"
    ],
    "capitalAliases": []
  },
  {
    "code": "er",
    "name": "Eritrea",
    "continent": "Africa",
    "capitals": [
      "Asmara"
    ],
    "aliases": [
      "State of Eritrea"
    ],
    "capitalAliases": []
  },
  {
    "code": "ee",
    "name": "Estonia",
    "continent": "Europe",
    "capitals": [
      "Tallinn"
    ],
    "aliases": [
      "Republic of Estonia"
    ],
    "capitalAliases": []
  },
  {
    "code": "sz",
    "name": "Eswatini",
    "continent": "Africa",
    "capitals": [
      "Mbabane",
      "Lobamba"
    ],
    "aliases": [
      "Swaziland",
      "Kingdom of Eswatini"
    ],
    "capitalAliases": []
  },
  {
    "code": "et",
    "name": "Ethiopia",
    "continent": "Africa",
    "capitals": [
      "Addis Ababa"
    ],
    "aliases": [
      "Federal Democratic Republic of Ethiopia"
    ],
    "capitalAliases": []
  },
  {
    "code": "fj",
    "name": "Fiji",
    "continent": "Oceania",
    "capitals": [
      "Suva"
    ],
    "aliases": [
      "Republic of Fiji"
    ],
    "capitalAliases": []
  },
  {
    "code": "fi",
    "name": "Finland",
    "continent": "Europe",
    "capitals": [
      "Helsinki"
    ],
    "aliases": [
      "Republic of Finland"
    ],
    "capitalAliases": []
  },
  {
    "code": "fr",
    "name": "France",
    "continent": "Europe",
    "capitals": [
      "Paris"
    ],
    "aliases": [
      "French Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "ga",
    "name": "Gabon",
    "continent": "Africa",
    "capitals": [
      "Libreville"
    ],
    "aliases": [
      "Gabonese Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "gm",
    "name": "Gambia",
    "continent": "Africa",
    "capitals": [
      "Banjul"
    ],
    "aliases": [
      "The Gambia",
      "Republic of the Gambia"
    ],
    "capitalAliases": []
  },
  {
    "code": "ge",
    "name": "Georgia",
    "continent": "Asia",
    "capitals": [
      "Tbilisi"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "de",
    "name": "Germany",
    "continent": "Europe",
    "capitals": [
      "Berlin"
    ],
    "aliases": [
      "Federal Republic of Germany"
    ],
    "capitalAliases": []
  },
  {
    "code": "gh",
    "name": "Ghana",
    "continent": "Africa",
    "capitals": [
      "Accra"
    ],
    "aliases": [
      "Republic of Ghana"
    ],
    "capitalAliases": []
  },
  {
    "code": "gr",
    "name": "Greece",
    "continent": "Europe",
    "capitals": [
      "Athens"
    ],
    "aliases": [
      "Hellenic Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "gd",
    "name": "Grenada",
    "continent": "North America",
    "capitals": [
      "St. George's"
    ],
    "aliases": [],
    "capitalAliases": [
      "Saint George's"
    ]
  },
  {
    "code": "gt",
    "name": "Guatemala",
    "continent": "North America",
    "capitals": [
      "Guatemala City"
    ],
    "aliases": [
      "Republic of Guatemala"
    ],
    "capitalAliases": [
      "Guatemala"
    ]
  },
  {
    "code": "gn",
    "name": "Guinea",
    "continent": "Africa",
    "capitals": [
      "Conakry"
    ],
    "aliases": [
      "Republic of Guinea"
    ],
    "capitalAliases": []
  },
  {
    "code": "gw",
    "name": "Guinea-Bissau",
    "continent": "Africa",
    "capitals": [
      "Bissau"
    ],
    "aliases": [
      "Republic of Guinea-Bissau"
    ],
    "capitalAliases": []
  },
  {
    "code": "gy",
    "name": "Guyana",
    "continent": "South America",
    "capitals": [
      "Georgetown"
    ],
    "aliases": [
      "Co-operative Republic of Guyana"
    ],
    "capitalAliases": []
  },
  {
    "code": "ht",
    "name": "Haiti",
    "continent": "North America",
    "capitals": [
      "Port-au-Prince"
    ],
    "aliases": [
      "Republic of Haiti"
    ],
    "capitalAliases": []
  },
  {
    "code": "hn",
    "name": "Honduras",
    "continent": "North America",
    "capitals": [
      "Tegucigalpa"
    ],
    "aliases": [
      "Republic of Honduras"
    ],
    "capitalAliases": []
  },
  {
    "code": "hu",
    "name": "Hungary",
    "continent": "Europe",
    "capitals": [
      "Budapest"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "is",
    "name": "Iceland",
    "continent": "Europe",
    "capitals": [
      "Reykjavík"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "in",
    "name": "India",
    "continent": "Asia",
    "capitals": [
      "New Delhi"
    ],
    "aliases": [
      "Republic of India"
    ],
    "capitalAliases": [
      "Delhi"
    ]
  },
  {
    "code": "id",
    "name": "Indonesia",
    "continent": "Asia",
    "capitals": [
      "Jakarta"
    ],
    "aliases": [
      "Republic of Indonesia"
    ],
    "capitalAliases": []
  },
  {
    "code": "ir",
    "name": "Iran",
    "continent": "Asia",
    "capitals": [
      "Tehran"
    ],
    "aliases": [
      "Islamic Republic of Iran"
    ],
    "capitalAliases": []
  },
  {
    "code": "iq",
    "name": "Iraq",
    "continent": "Asia",
    "capitals": [
      "Baghdad"
    ],
    "aliases": [
      "Republic of Iraq"
    ],
    "capitalAliases": []
  },
  {
    "code": "ie",
    "name": "Ireland",
    "continent": "Europe",
    "capitals": [
      "Dublin"
    ],
    "aliases": [
      "Republic of Ireland"
    ],
    "capitalAliases": []
  },
  {
    "code": "il",
    "name": "Israel",
    "continent": "Asia",
    "capitals": [
      "Jerusalem"
    ],
    "aliases": [
      "State of Israel"
    ],
    "capitalAliases": []
  },
  {
    "code": "it",
    "name": "Italy",
    "continent": "Europe",
    "capitals": [
      "Rome"
    ],
    "aliases": [
      "Italian Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "ci",
    "name": "Ivory Coast",
    "continent": "Africa",
    "capitals": [
      "Yamoussoukro"
    ],
    "aliases": [
      "Côte d'Ivoire",
      "Cote d'Ivoire",
      "Republic of Côte d'Ivoire"
    ],
    "capitalAliases": [
      "Abidjan"
    ]
  },
  {
    "code": "jm",
    "name": "Jamaica",
    "continent": "North America",
    "capitals": [
      "Kingston"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "jp",
    "name": "Japan",
    "continent": "Asia",
    "capitals": [
      "Tokyo"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "jo",
    "name": "Jordan",
    "continent": "Asia",
    "capitals": [
      "Amman"
    ],
    "aliases": [
      "Hashemite Kingdom of Jordan"
    ],
    "capitalAliases": []
  },
  {
    "code": "kz",
    "name": "Kazakhstan",
    "continent": "Asia",
    "capitals": [
      "Astana"
    ],
    "aliases": [
      "Republic of Kazakhstan"
    ],
    "capitalAliases": []
  },
  {
    "code": "ke",
    "name": "Kenya",
    "continent": "Africa",
    "capitals": [
      "Nairobi"
    ],
    "aliases": [
      "Republic of Kenya"
    ],
    "capitalAliases": []
  },
  {
    "code": "ki",
    "name": "Kiribati",
    "continent": "Oceania",
    "capitals": [
      "Tarawa"
    ],
    "aliases": [
      "Independent and Sovereign Republic of Kiribati"
    ],
    "capitalAliases": [
      "South Tarawa"
    ]
  },
  {
    "code": "xk",
    "name": "Kosovo",
    "continent": "Europe",
    "capitals": [
      "Pristina"
    ],
    "aliases": [
      "Republic of Kosovo"
    ],
    "capitalAliases": []
  },
  {
    "code": "kw",
    "name": "Kuwait",
    "continent": "Asia",
    "capitals": [
      "Kuwait City"
    ],
    "aliases": [
      "State of Kuwait"
    ],
    "capitalAliases": [
      "Kuwait"
    ]
  },
  {
    "code": "kg",
    "name": "Kyrgyzstan",
    "continent": "Asia",
    "capitals": [
      "Bishkek"
    ],
    "aliases": [
      "Kyrgyz Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "la",
    "name": "Laos",
    "continent": "Asia",
    "capitals": [
      "Vientiane"
    ],
    "aliases": [
      "Lao People's Democratic Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "lv",
    "name": "Latvia",
    "continent": "Europe",
    "capitals": [
      "Riga"
    ],
    "aliases": [
      "Republic of Latvia"
    ],
    "capitalAliases": []
  },
  {
    "code": "lb",
    "name": "Lebanon",
    "continent": "Asia",
    "capitals": [
      "Beirut"
    ],
    "aliases": [
      "Lebanese Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "ls",
    "name": "Lesotho",
    "continent": "Africa",
    "capitals": [
      "Maseru"
    ],
    "aliases": [
      "Kingdom of Lesotho"
    ],
    "capitalAliases": []
  },
  {
    "code": "lr",
    "name": "Liberia",
    "continent": "Africa",
    "capitals": [
      "Monrovia"
    ],
    "aliases": [
      "Republic of Liberia"
    ],
    "capitalAliases": []
  },
  {
    "code": "ly",
    "name": "Libya",
    "continent": "Africa",
    "capitals": [
      "Tripoli"
    ],
    "aliases": [
      "State of Libya"
    ],
    "capitalAliases": []
  },
  {
    "code": "li",
    "name": "Liechtenstein",
    "continent": "Europe",
    "capitals": [
      "Vaduz"
    ],
    "aliases": [
      "Principality of Liechtenstein"
    ],
    "capitalAliases": []
  },
  {
    "code": "lt",
    "name": "Lithuania",
    "continent": "Europe",
    "capitals": [
      "Vilnius"
    ],
    "aliases": [
      "Republic of Lithuania"
    ],
    "capitalAliases": []
  },
  {
    "code": "lu",
    "name": "Luxembourg",
    "continent": "Europe",
    "capitals": [
      "Luxembourg"
    ],
    "aliases": [
      "Grand Duchy of Luxembourg"
    ],
    "capitalAliases": []
  },
  {
    "code": "mg",
    "name": "Madagascar",
    "continent": "Africa",
    "capitals": [
      "Antananarivo"
    ],
    "aliases": [
      "Republic of Madagascar"
    ],
    "capitalAliases": []
  },
  {
    "code": "mw",
    "name": "Malawi",
    "continent": "Africa",
    "capitals": [
      "Lilongwe"
    ],
    "aliases": [
      "Republic of Malawi"
    ],
    "capitalAliases": []
  },
  {
    "code": "my",
    "name": "Malaysia",
    "continent": "Asia",
    "capitals": [
      "Kuala Lumpur"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "mv",
    "name": "Maldives",
    "continent": "Asia",
    "capitals": [
      "Malé"
    ],
    "aliases": [
      "Republic of the Maldives"
    ],
    "capitalAliases": []
  },
  {
    "code": "ml",
    "name": "Mali",
    "continent": "Africa",
    "capitals": [
      "Bamako"
    ],
    "aliases": [
      "Republic of Mali"
    ],
    "capitalAliases": []
  },
  {
    "code": "mt",
    "name": "Malta",
    "continent": "Europe",
    "capitals": [
      "Valletta"
    ],
    "aliases": [
      "Republic of Malta"
    ],
    "capitalAliases": []
  },
  {
    "code": "mh",
    "name": "Marshall Islands",
    "continent": "Oceania",
    "capitals": [
      "Majuro"
    ],
    "aliases": [
      "Republic of the Marshall Islands"
    ],
    "capitalAliases": []
  },
  {
    "code": "mr",
    "name": "Mauritania",
    "continent": "Africa",
    "capitals": [
      "Nouakchott"
    ],
    "aliases": [
      "Islamic Republic of Mauritania"
    ],
    "capitalAliases": []
  },
  {
    "code": "mu",
    "name": "Mauritius",
    "continent": "Africa",
    "capitals": [
      "Port Louis"
    ],
    "aliases": [
      "Republic of Mauritius"
    ],
    "capitalAliases": []
  },
  {
    "code": "mx",
    "name": "Mexico",
    "continent": "North America",
    "capitals": [
      "Mexico City"
    ],
    "aliases": [
      "United Mexican States"
    ],
    "capitalAliases": [
      "Mexico"
    ]
  },
  {
    "code": "fm",
    "name": "Micronesia",
    "continent": "Oceania",
    "capitals": [
      "Palikir"
    ],
    "aliases": [
      "Federated States of Micronesia"
    ],
    "capitalAliases": []
  },
  {
    "code": "md",
    "name": "Moldova",
    "continent": "Europe",
    "capitals": [
      "Chișinău"
    ],
    "aliases": [
      "Republic of Moldova"
    ],
    "capitalAliases": []
  },
  {
    "code": "mc",
    "name": "Monaco",
    "continent": "Europe",
    "capitals": [
      "Monaco"
    ],
    "aliases": [
      "Principality of Monaco"
    ],
    "capitalAliases": []
  },
  {
    "code": "mn",
    "name": "Mongolia",
    "continent": "Asia",
    "capitals": [
      "Ulaanbaatar"
    ],
    "aliases": [],
    "capitalAliases": [
      "Ulan Bator"
    ]
  },
  {
    "code": "me",
    "name": "Montenegro",
    "continent": "Europe",
    "capitals": [
      "Podgorica"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "ma",
    "name": "Morocco",
    "continent": "Africa",
    "capitals": [
      "Rabat"
    ],
    "aliases": [
      "Kingdom of Morocco"
    ],
    "capitalAliases": []
  },
  {
    "code": "mz",
    "name": "Mozambique",
    "continent": "Africa",
    "capitals": [
      "Maputo"
    ],
    "aliases": [
      "Republic of Mozambique"
    ],
    "capitalAliases": []
  },
  {
    "code": "mm",
    "name": "Myanmar",
    "continent": "Asia",
    "capitals": [
      "Naypyidaw"
    ],
    "aliases": [
      "Burma",
      "Republic of the Union of Myanmar"
    ],
    "capitalAliases": [
      "Nay Pyi Taw",
      "Naypyitaw"
    ]
  },
  {
    "code": "na",
    "name": "Namibia",
    "continent": "Africa",
    "capitals": [
      "Windhoek"
    ],
    "aliases": [
      "Republic of Namibia"
    ],
    "capitalAliases": []
  },
  {
    "code": "nr",
    "name": "Nauru",
    "continent": "Oceania",
    "capitals": [
      "Yaren"
    ],
    "aliases": [
      "Republic of Nauru"
    ],
    "capitalAliases": []
  },
  {
    "code": "np",
    "name": "Nepal",
    "continent": "Asia",
    "capitals": [
      "Kathmandu"
    ],
    "aliases": [
      "Federal Democratic Republic of Nepal"
    ],
    "capitalAliases": []
  },
  {
    "code": "nl",
    "name": "Netherlands",
    "continent": "Europe",
    "capitals": [
      "Amsterdam"
    ],
    "aliases": [
      "Holland",
      "The Netherlands",
      "Kingdom of the Netherlands"
    ],
    "capitalAliases": []
  },
  {
    "code": "nz",
    "name": "New Zealand",
    "continent": "Oceania",
    "capitals": [
      "Wellington"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "ni",
    "name": "Nicaragua",
    "continent": "North America",
    "capitals": [
      "Managua"
    ],
    "aliases": [
      "Republic of Nicaragua"
    ],
    "capitalAliases": []
  },
  {
    "code": "ne",
    "name": "Niger",
    "continent": "Africa",
    "capitals": [
      "Niamey"
    ],
    "aliases": [
      "Republic of Niger"
    ],
    "capitalAliases": []
  },
  {
    "code": "ng",
    "name": "Nigeria",
    "continent": "Africa",
    "capitals": [
      "Abuja"
    ],
    "aliases": [
      "Federal Republic of Nigeria"
    ],
    "capitalAliases": []
  },
  {
    "code": "kp",
    "name": "North Korea",
    "continent": "Asia",
    "capitals": [
      "Pyongyang"
    ],
    "aliases": [
      "DPRK",
      "Democratic People's Republic of Korea"
    ],
    "capitalAliases": []
  },
  {
    "code": "mk",
    "name": "North Macedonia",
    "continent": "Europe",
    "capitals": [
      "Skopje"
    ],
    "aliases": [
      "Macedonia",
      "Republic of North Macedonia"
    ],
    "capitalAliases": []
  },
  {
    "code": "no",
    "name": "Norway",
    "continent": "Europe",
    "capitals": [
      "Oslo"
    ],
    "aliases": [
      "Kingdom of Norway"
    ],
    "capitalAliases": []
  },
  {
    "code": "om",
    "name": "Oman",
    "continent": "Asia",
    "capitals": [
      "Muscat"
    ],
    "aliases": [
      "Sultanate of Oman"
    ],
    "capitalAliases": []
  },
  {
    "code": "pk",
    "name": "Pakistan",
    "continent": "Asia",
    "capitals": [
      "Islamabad"
    ],
    "aliases": [
      "Islamic Republic of Pakistan"
    ],
    "capitalAliases": []
  },
  {
    "code": "pw",
    "name": "Palau",
    "continent": "Oceania",
    "capitals": [
      "Ngerulmud"
    ],
    "aliases": [
      "Republic of Palau"
    ],
    "capitalAliases": []
  },
  {
    "code": "ps",
    "name": "Palestine",
    "continent": "Asia",
    "capitals": [
      "East Jerusalem",
      "Ramallah"
    ],
    "aliases": [
      "State of Palestine"
    ],
    "capitalAliases": [
      "Jerusalem"
    ]
  },
  {
    "code": "pa",
    "name": "Panama",
    "continent": "North America",
    "capitals": [
      "Panama City"
    ],
    "aliases": [
      "Republic of Panama"
    ],
    "capitalAliases": [
      "Panama"
    ]
  },
  {
    "code": "pg",
    "name": "Papua New Guinea",
    "continent": "Oceania",
    "capitals": [
      "Port Moresby"
    ],
    "aliases": [
      "Independent State of Papua New Guinea"
    ],
    "capitalAliases": []
  },
  {
    "code": "py",
    "name": "Paraguay",
    "continent": "South America",
    "capitals": [
      "Asunción"
    ],
    "aliases": [
      "Republic of Paraguay"
    ],
    "capitalAliases": []
  },
  {
    "code": "pe",
    "name": "Peru",
    "continent": "South America",
    "capitals": [
      "Lima"
    ],
    "aliases": [
      "Republic of Peru"
    ],
    "capitalAliases": []
  },
  {
    "code": "ph",
    "name": "Philippines",
    "continent": "Asia",
    "capitals": [
      "Manila"
    ],
    "aliases": [
      "Republic of the Philippines"
    ],
    "capitalAliases": []
  },
  {
    "code": "pl",
    "name": "Poland",
    "continent": "Europe",
    "capitals": [
      "Warsaw"
    ],
    "aliases": [
      "Republic of Poland"
    ],
    "capitalAliases": []
  },
  {
    "code": "pt",
    "name": "Portugal",
    "continent": "Europe",
    "capitals": [
      "Lisbon"
    ],
    "aliases": [
      "Portuguese Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "qa",
    "name": "Qatar",
    "continent": "Asia",
    "capitals": [
      "Doha"
    ],
    "aliases": [
      "State of Qatar"
    ],
    "capitalAliases": []
  },
  {
    "code": "cg",
    "name": "Republic of the Congo",
    "continent": "Africa",
    "capitals": [
      "Brazzaville"
    ],
    "aliases": [
      "Congo",
      "Congo-Brazzaville",
      "Congo Brazzaville"
    ],
    "capitalAliases": []
  },
  {
    "code": "ro",
    "name": "Romania",
    "continent": "Europe",
    "capitals": [
      "Bucharest"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "ru",
    "name": "Russia",
    "continent": "Europe",
    "capitals": [
      "Moscow"
    ],
    "aliases": [
      "Russian Federation"
    ],
    "capitalAliases": []
  },
  {
    "code": "rw",
    "name": "Rwanda",
    "continent": "Africa",
    "capitals": [
      "Kigali"
    ],
    "aliases": [
      "Republic of Rwanda"
    ],
    "capitalAliases": []
  },
  {
    "code": "kn",
    "name": "Saint Kitts and Nevis",
    "continent": "North America",
    "capitals": [
      "Basseterre"
    ],
    "aliases": [
      "Saint Christopher and Nevis",
      "Federation of Saint Christopher and Nevis"
    ],
    "capitalAliases": []
  },
  {
    "code": "lc",
    "name": "Saint Lucia",
    "continent": "North America",
    "capitals": [
      "Castries"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "vc",
    "name": "Saint Vincent and the Grenadines",
    "continent": "North America",
    "capitals": [
      "Kingstown"
    ],
    "aliases": [
      "Saint Vincent"
    ],
    "capitalAliases": []
  },
  {
    "code": "ws",
    "name": "Samoa",
    "continent": "Oceania",
    "capitals": [
      "Apia"
    ],
    "aliases": [
      "Independent State of Samoa"
    ],
    "capitalAliases": []
  },
  {
    "code": "sm",
    "name": "San Marino",
    "continent": "Europe",
    "capitals": [
      "San Marino"
    ],
    "aliases": [
      "Most Serene Republic of San Marino"
    ],
    "capitalAliases": [
      "City of San Marino"
    ]
  },
  {
    "code": "st",
    "name": "São Tomé and Príncipe",
    "continent": "Africa",
    "capitals": [
      "São Tomé"
    ],
    "aliases": [
      "Democratic Republic of São Tomé and Príncipe"
    ],
    "capitalAliases": []
  },
  {
    "code": "sa",
    "name": "Saudi Arabia",
    "continent": "Asia",
    "capitals": [
      "Riyadh"
    ],
    "aliases": [
      "Kingdom of Saudi Arabia"
    ],
    "capitalAliases": []
  },
  {
    "code": "sn",
    "name": "Senegal",
    "continent": "Africa",
    "capitals": [
      "Dakar"
    ],
    "aliases": [
      "Republic of Senegal"
    ],
    "capitalAliases": []
  },
  {
    "code": "rs",
    "name": "Serbia",
    "continent": "Europe",
    "capitals": [
      "Belgrade"
    ],
    "aliases": [
      "Republic of Serbia"
    ],
    "capitalAliases": []
  },
  {
    "code": "sc",
    "name": "Seychelles",
    "continent": "Africa",
    "capitals": [
      "Victoria"
    ],
    "aliases": [
      "Republic of Seychelles"
    ],
    "capitalAliases": []
  },
  {
    "code": "sl",
    "name": "Sierra Leone",
    "continent": "Africa",
    "capitals": [
      "Freetown"
    ],
    "aliases": [
      "Republic of Sierra Leone"
    ],
    "capitalAliases": []
  },
  {
    "code": "sg",
    "name": "Singapore",
    "continent": "Asia",
    "capitals": [
      "Singapore"
    ],
    "aliases": [
      "Republic of Singapore"
    ],
    "capitalAliases": []
  },
  {
    "code": "sk",
    "name": "Slovakia",
    "continent": "Europe",
    "capitals": [
      "Bratislava"
    ],
    "aliases": [
      "Slovak Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "si",
    "name": "Slovenia",
    "continent": "Europe",
    "capitals": [
      "Ljubljana"
    ],
    "aliases": [
      "Republic of Slovenia"
    ],
    "capitalAliases": []
  },
  {
    "code": "sb",
    "name": "Solomon Islands",
    "continent": "Oceania",
    "capitals": [
      "Honiara"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "so",
    "name": "Somalia",
    "continent": "Africa",
    "capitals": [
      "Mogadishu"
    ],
    "aliases": [
      "Federal Republic of Somalia"
    ],
    "capitalAliases": []
  },
  {
    "code": "za",
    "name": "South Africa",
    "continent": "Africa",
    "capitals": [
      "Pretoria",
      "Cape Town",
      "Bloemfontein"
    ],
    "aliases": [
      "Republic of South Africa"
    ],
    "capitalAliases": []
  },
  {
    "code": "kr",
    "name": "South Korea",
    "continent": "Asia",
    "capitals": [
      "Seoul"
    ],
    "aliases": [
      "Korea",
      "Republic of Korea"
    ],
    "capitalAliases": []
  },
  {
    "code": "ss",
    "name": "South Sudan",
    "continent": "Africa",
    "capitals": [
      "Juba"
    ],
    "aliases": [
      "Republic of South Sudan"
    ],
    "capitalAliases": []
  },
  {
    "code": "es",
    "name": "Spain",
    "continent": "Europe",
    "capitals": [
      "Madrid"
    ],
    "aliases": [
      "Kingdom of Spain"
    ],
    "capitalAliases": []
  },
  {
    "code": "lk",
    "name": "Sri Lanka",
    "continent": "Asia",
    "capitals": [
      "Sri Jayawardenepura Kotte",
      "Colombo"
    ],
    "aliases": [
      "Democratic Socialist Republic of Sri Lanka"
    ],
    "capitalAliases": [
      "Kotte"
    ]
  },
  {
    "code": "sd",
    "name": "Sudan",
    "continent": "Africa",
    "capitals": [
      "Khartoum"
    ],
    "aliases": [
      "Republic of the Sudan"
    ],
    "capitalAliases": []
  },
  {
    "code": "sr",
    "name": "Suriname",
    "continent": "South America",
    "capitals": [
      "Paramaribo"
    ],
    "aliases": [
      "Republic of Suriname"
    ],
    "capitalAliases": []
  },
  {
    "code": "se",
    "name": "Sweden",
    "continent": "Europe",
    "capitals": [
      "Stockholm"
    ],
    "aliases": [
      "Kingdom of Sweden"
    ],
    "capitalAliases": []
  },
  {
    "code": "ch",
    "name": "Switzerland",
    "continent": "Europe",
    "capitals": [
      "Bern"
    ],
    "aliases": [
      "Swiss Confederation"
    ],
    "capitalAliases": []
  },
  {
    "code": "sy",
    "name": "Syria",
    "continent": "Asia",
    "capitals": [
      "Damascus"
    ],
    "aliases": [
      "Syrian Arab Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "tw",
    "name": "Taiwan",
    "continent": "Asia",
    "capitals": [
      "Taipei"
    ],
    "aliases": [
      "Republic of China (Taiwan)"
    ],
    "capitalAliases": [
      "Taipei City"
    ]
  },
  {
    "code": "tj",
    "name": "Tajikistan",
    "continent": "Asia",
    "capitals": [
      "Dushanbe"
    ],
    "aliases": [
      "Republic of Tajikistan"
    ],
    "capitalAliases": []
  },
  {
    "code": "tz",
    "name": "Tanzania",
    "continent": "Africa",
    "capitals": [
      "Dodoma"
    ],
    "aliases": [
      "United Republic of Tanzania"
    ],
    "capitalAliases": []
  },
  {
    "code": "th",
    "name": "Thailand",
    "continent": "Asia",
    "capitals": [
      "Bangkok"
    ],
    "aliases": [
      "Kingdom of Thailand"
    ],
    "capitalAliases": []
  },
  {
    "code": "tl",
    "name": "Timor-Leste",
    "continent": "Asia",
    "capitals": [
      "Dili"
    ],
    "aliases": [
      "East Timor",
      "Democratic Republic of Timor-Leste"
    ],
    "capitalAliases": []
  },
  {
    "code": "tg",
    "name": "Togo",
    "continent": "Africa",
    "capitals": [
      "Lomé"
    ],
    "aliases": [
      "Togolese Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "to",
    "name": "Tonga",
    "continent": "Oceania",
    "capitals": [
      "Nuku'alofa"
    ],
    "aliases": [
      "Kingdom of Tonga"
    ],
    "capitalAliases": []
  },
  {
    "code": "tt",
    "name": "Trinidad and Tobago",
    "continent": "North America",
    "capitals": [
      "Port of Spain"
    ],
    "aliases": [
      "Republic of Trinidad and Tobago"
    ],
    "capitalAliases": []
  },
  {
    "code": "tn",
    "name": "Tunisia",
    "continent": "Africa",
    "capitals": [
      "Tunis"
    ],
    "aliases": [
      "Tunisian Republic"
    ],
    "capitalAliases": []
  },
  {
    "code": "tr",
    "name": "Turkey",
    "continent": "Asia",
    "capitals": [
      "Ankara"
    ],
    "aliases": [
      "Türkiye",
      "Turkiye",
      "Republic of Türkiye"
    ],
    "capitalAliases": []
  },
  {
    "code": "tm",
    "name": "Turkmenistan",
    "continent": "Asia",
    "capitals": [
      "Ashgabat"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "tv",
    "name": "Tuvalu",
    "continent": "Oceania",
    "capitals": [
      "Funafuti"
    ],
    "aliases": [],
    "capitalAliases": []
  },
  {
    "code": "ug",
    "name": "Uganda",
    "continent": "Africa",
    "capitals": [
      "Kampala"
    ],
    "aliases": [
      "Republic of Uganda"
    ],
    "capitalAliases": []
  },
  {
    "code": "ua",
    "name": "Ukraine",
    "continent": "Europe",
    "capitals": [
      "Kyiv"
    ],
    "aliases": [],
    "capitalAliases": [
      "Kiev"
    ]
  },
  {
    "code": "ae",
    "name": "United Arab Emirates",
    "continent": "Asia",
    "capitals": [
      "Abu Dhabi"
    ],
    "aliases": [
      "UAE"
    ],
    "capitalAliases": []
  },
  {
    "code": "gb",
    "name": "United Kingdom",
    "continent": "Europe",
    "capitals": [
      "London"
    ],
    "aliases": [
      "UK",
      "Great Britain",
      "Britain",
      "United Kingdom of Great Britain and Northern Ireland"
    ],
    "capitalAliases": []
  },
  {
    "code": "us",
    "name": "United States",
    "continent": "North America",
    "capitals": [
      "Washington, D.C."
    ],
    "aliases": [
      "USA",
      "US",
      "America",
      "United States of America"
    ],
    "capitalAliases": [
      "Washington",
      "Washington DC"
    ]
  },
  {
    "code": "uy",
    "name": "Uruguay",
    "continent": "South America",
    "capitals": [
      "Montevideo"
    ],
    "aliases": [
      "Oriental Republic of Uruguay"
    ],
    "capitalAliases": []
  },
  {
    "code": "uz",
    "name": "Uzbekistan",
    "continent": "Asia",
    "capitals": [
      "Tashkent"
    ],
    "aliases": [
      "Republic of Uzbekistan"
    ],
    "capitalAliases": []
  },
  {
    "code": "vu",
    "name": "Vanuatu",
    "continent": "Oceania",
    "capitals": [
      "Port Vila"
    ],
    "aliases": [
      "Republic of Vanuatu"
    ],
    "capitalAliases": []
  },
  {
    "code": "va",
    "name": "Vatican City",
    "continent": "Europe",
    "capitals": [
      "Vatican City"
    ],
    "aliases": [
      "Holy See",
      "Vatican",
      "Vatican City State"
    ],
    "capitalAliases": []
  },
  {
    "code": "ve",
    "name": "Venezuela",
    "continent": "South America",
    "capitals": [
      "Caracas"
    ],
    "aliases": [
      "Bolivarian Republic of Venezuela"
    ],
    "capitalAliases": []
  },
  {
    "code": "vn",
    "name": "Vietnam",
    "continent": "Asia",
    "capitals": [
      "Hanoi"
    ],
    "aliases": [
      "Socialist Republic of Vietnam"
    ],
    "capitalAliases": []
  },
  {
    "code": "ye",
    "name": "Yemen",
    "continent": "Asia",
    "capitals": [
      "Sana'a"
    ],
    "aliases": [
      "Republic of Yemen"
    ],
    "capitalAliases": []
  },
  {
    "code": "zm",
    "name": "Zambia",
    "continent": "Africa",
    "capitals": [
      "Lusaka"
    ],
    "aliases": [
      "Republic of Zambia"
    ],
    "capitalAliases": []
  },
  {
    "code": "zw",
    "name": "Zimbabwe",
    "continent": "Africa",
    "capitals": [
      "Harare"
    ],
    "aliases": [
      "Republic of Zimbabwe"
    ],
    "capitalAliases": []
  }
];
