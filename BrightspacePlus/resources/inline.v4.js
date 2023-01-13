/* 
 * TODO's:
 *
 * Video's, Wooclaps, PDF's en presentaties pas laden nadat alles is opgemaakt.
 * PPTX-viewer toevoegen.
 * Waiting for toevoegen aan div voor PPTX.
 * Waiting for toevoegen aan div's.
 * Overstappen naar <pre> (zonder extra class) als kenmerk van de uitwerking van een opdracht.
 * Overstappen naar <div blended...>, <div faq...>, div etc.
 * FAQ met keuze voor wel of niet tegelijk items openzetten.
 * active-class voor FAQ hernoemen naar faq-active.
 * Cookie voor instelling FAQ.
 * Classes toevoegen voor PDF en PPTX.
 * Objecten voor PDF en PPTX toevoegen aan arrContent [].
 * Strategy Pattern gebruiken om blended elementen om te vormen naar de juiste opmaak en content.
 * Classes nu ook toepassen voor video, wooclap, download etc..
 * Alle variabelen met elm... hernoemen naar dom...
 * FAQVragen apart trekken als Observable
 * Hoofdstukken als objecten toevoegen aan Inhoudsopgave.
 * Objecten toevoegen aan arrContent [].
 * content [] verwijderen
 * arrContent al vullen als paragrafen worden geteld en ook de blended elementen worden langsgelopen.
 * Gemeenschappelijke elementen bij het aanmaken van boxen in methodes onderbrengen.
 * Het uitkleden van het toevoegen van blended div's, zodat alleen de elementID in eerste instantie wordt
   meegegeven en in de verschillende functions de gegevens worden uitgelezen uit de div.
 * Voor het toggelen van blended elementen een class introduceren, zodat JavaScript kleiner kan.
 * Combinatie van Tags en Attributes implementeren en getElementsByTagName -> getElementsByName: zowel
   voor h2, h3 etc. als voor blended, faq etc.. Daarbij moeten ook class='blended-wrapper' nog worden
   meegenomen.
 * Breedte wordt wel opgehaald, maar de juiste breedte wordt nog niet in de combobox getoond.	
 * Inhoudsopgave gelijk maken aan div inhoudsopgave.
 * Lijst met filmpjes gelijk maken aan div video-list met een div.
 * Volgorde van het aanmaken controleren en dubbele loops killen waar mogelijk.
 * Is het aanmaken van de links op de juiste plek opgenomen?
 * Aanmaken titels voor het creëren van paragraafnummers.
 * PDF-viewer toggable maken.
 * PDF en Cheat Sheet in structuur onderbrengen.
 * Student kan voor de paragrafen kiezen voor 1 tegelijk open of alles tegelijk open met een toggle-bar geleend
   van BrightSpace.
 * Blended voor Wooclap controleren en aanpassen (bijv. uitbreiden voor wooflash met voorbeeld).
 * Pas de constantes voor URL en EMBED zo aan dat de %id in de link vervangen kan worden (zoals bij de pptx).
 * Waiting for toevoegen aan div voor PDF.
 * Alle bovenstaande stappen controleren voor inhoudsopgave, lijst met films, content voor video, wooclap, 
   uitwerking van een opdracht, download-box, FAQ, PPTX en PDF.
 - Opruimen code-smells.
 - Opruimen oude code die overbodig is geworden.
 - Overal consequent CONSTANTES gebruiken (zowel in HTML, in CSS, in Blended als in JavaScript)
 - PDF-viewer op 100% laten openen.
 */

// /////////////////////////////////////////////////////////////////////////// //
// LET OP: Hieronder wordt gebruik gemaakt van strRootDir. Dit is de directory //
// waarin de file staat, waaraan onderstaande JavaScript is toegevoegd.        //
// Deze is daar nodig om deze JavaScript toe te voegen aan de pagina en deze   //
// kan hieronder dus worden gebruikt.                                          //
// /////////////////////////////////////////////////////////////////////////// //

// /////////////////////////////////////////////////////////////////////////// //

/*
 * De juiste css wordt toegevoegd aan de pagina in BrightSpace.
 */
var domCSS = document.createElement ('link');
var strCSSFileName = strRootDir + '/resources/brightspace.v4.css';

domCSS.rel = 'stylesheet';
domCSS.type = 'text/css';
domCSS.href = strCSSFileName;
domCSS.media = 'all';
document.head.appendChild (domCSS);

domCSS.addEventListener ("load", () => { logMessage ('css', strCSSFileName, false); });
domCSS.addEventListener ("error", (ev) => { logMessage ('css', strCSSFileName, true); });

// /////////////////////////////////////////////////////////////////////////// //

var objPagina;

// /////////////////////////////////////////////////////////////////////////// //

const INHOUDSOPGAVE = 'inhoudsopgave';
const VIDEOLIST = 'video-list';
const MEDIASITE = 'mediasite';
const STREAM = 'stream';
const YOUTUBE = 'youtube';
const UITWERKING = 'uitwerking';
const QUIZ = 'quiz';
const WOOCLAP = 'wooclap';
const WOOFLASH = 'wooflash';
const PROEFTOETS = 'proeftoets';
const QUIZVRAAG = 'wooclap-vraag';
const DOWNLOAD = 'download';
const FAQ = 'faq';
const POWERPOINT = 'pptx';
const POWERPOINT_ONEDRIVE = POWERPOINT + '-onedrive';
const POWERPOINT_TEAMS = POWERPOINT + '-teams-of-sharepoint';
const PDF = 'pdf';
const TEST = 'test';

const VORIGE = 'vorige';
const VOLGENDE = 'volgende';

const EXTRA_STOF = 'extra:';

// /////////////////////////////////////////////////////////////////////////// //

const MEDIASITE_BASE_URL = 'https://hhs.mediamission.nl/Mediasite/Play/%id';
const MEDIASITE_BASE_EMBED = MEDIASITE_BASE_URL;
const STREAM_BASE_URL = 'https://web.microsoftstream.com/video/%id';
const STREAM_BASE_EMBED = 'https://web.microsoftstream.com/embed/video/%id';
const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v=%id';
const YOUTUBE_BASE_EMBED = 'https://www.youtube.com/embed/%id';
const WOOCLAP_BASE_EMBED = 'https://app.wooclap.com/%link';
const WOOFLASH_BASE_EMBED = 'https://app.wooflash.com/study/%id';
const ONEDRIVE_BASE_URL = 'https://dehaagsehogeschool-my.sharepoint.com/personal/%account/_layouts/15/Doc.aspx?sourcedoc={%id}';
const ONEDRIVE_BASE_EMBED = ONEDRIVE_BASE_URL + '&amp;action=embedview&amp;wdAr=1.7777777777777777';
const TEAMS_OF_SP_BASE_URL = 'https://dehaagsehogeschool.sharepoint.com/sites/%site/_layouts/15/Doc.aspx?sourcedoc={%id}';
const TEAMS_OF_SP_BASE_EMBED = TEAMS_OF_SP_BASE_URL + '&amp;action=embedview&amp;wdAr=1.7777777777777777';

// /////////////////////////////////////////////////////////////////////////// //

const BLENDED_WRAPPER = 'blended-wrapper';
const SECTIE = 'sectie-';

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Voor het afhandelen van links zijn twee custom events aangemaakt.
 */
const ACTIVEER_LINK = 'activeerlink';
const activeerLinkEvent = new Event (ACTIVEER_LINK);
const DEACTIVEER_LINK = 'deactiveerlink'
const deactiveerLinkEvent = new Event (DEACTIVEER_LINK);

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Als de huidige JavaScript-file is geladen worden de volgende tests uitgevoerd
 * (als tenminste Test.blnTestsShouldBeExecuted true is).
 */ 
document.getElementById (strScriptID).onload = function () {

	if (Test.blnTestsShouldBeExecuted) {
		testConvertValue ();
		Cookie.test ();
		Studietijd.testGetGeschrevenTijd ();
		Studietijd.testStudietijd ();
		TestFAQSetup.test ();
		Test.test ();
	};
}

// /////////////////////////////////////////////////////////////////////////// //

function toonAlleEventsInTabel () {

	if (Test.blnTestsShouldBeExecuted) {

		const allElements = Array.prototype.slice.call (document.querySelectorAll ('*'));
		allElements.push (document);
		allElements.push (window);

		const types = [];

		for (let ev in window) {
			if (/^on/.test (ev)) types [types.length] = ev;
		}

		let elements = [];

		for (let i = 0; i < allElements.length; i++) {

			const currentElement = allElements [i];

		    for (let j = 0; j < types.length; j++) {

		    	if (typeof currentElement [types [j]] === 'function') {

		        	elements.push ({
		        		"node": currentElement,
		        		"type": types [j],
		        		"func": currentElement [types [j]].toString (),
		        	});
		        }
		    }
		}

		console.table (elements.sort (function (a,b) {
			return a.type.localeCompare (b.type);
		}));
	}
}

// /////////////////////////////////////////////////////////////////////////// //

const FAQActions = {
	select: 'select',
	expand: 'expand',
	minify: 'minify'
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Als het hele HTML-document geladen is, worden de blended divs gevuld met
 * de juiste content en opgemaakt.
 */
window.onload = function (event) {

	objPagina = new Pagina ();
	objPagina.addSecties ();
	objPagina.updateLinks ();
	objPagina.embedContent ();
	// toonAlleEventsInTabel ();
};

// /////////////////////////////////////////////////////////////////////////// //

class Placeholder {

	/*
	 * De placeholder (bijv. %t) in tekst wordt vervangen door een replacement.
	 */
	static replacePlaceholderInTekst (strTekst, strPlaceholder, strReplacement) {

		if (strReplacement != null) {
			return strTekst.replaceAll (strPlaceholder, strReplacement);
		}
		else {
			return strTekst;
		}
	}

	/*
	 * %t in een titel wordt vervangen door een type.
	 */
	static replaceTypeInTekst (strTekst, strType) {
		return Placeholder.replacePlaceholderInTekst (strTekst, "%t", strType);
	}

	/*
	 * %p in een titel wordt vervangen door een paragraaf. Als paragraaf het woord 'Hoofdstuk'
	 * bevat wordt dit verwijderd.
	 */
	static replaceParagraphInTekst (strTekst, strParagraph) {
		strTekst = Placeholder.replacePlaceholderInTekst (strTekst, "%p", strParagraph);
		return Placeholder.replacePlaceholderInTekst (strTekst, "Hoofdstuk", "");
	}

	/*
	 * De palceholders %t en %p in een titel worden vervangen door het type en de nummering
	 * van een paragraaf waarnaar wordt verwezen.
	 */
	static replacePlaceholdersInTekst (strTekst, strType, strParagraph) {

		if (strTekst) {
			strTekst = Placeholder.replaceTypeInTekst (strTekst, strType);
			return Placeholder.replaceParagraphInTekst (strTekst, strParagraph);
		}

		return '';
	}

	/*
	 * Geef het element met de tag h2, h3 of h4 en het gewenste paragraafnummer terug.
	 */

	static getElementMetParagraafnummer (strParagraph) {

		if (strParagraph) {

			for (const domH of getElementsByNames ('h2,h3,h4')) {

				if (domH.getAttribute ('paragraph') == strParagraph) {
					return domH;
				}
			}
		}

		return null;
	}

	/*
	 * Gebaseeerd op het paragraafnummer wordt het type van de betreffende paragraaf bepaald 
	 * en worden in de titel %p en %t vervangen door deze paragraaf en dit type.
	 */
	static replacePlaceholdersInTitle  (strTitle, strType, strParagraph) {

		if (!strType) {

			strType = "";
			var domParagraaf = Placeholder.getElementMetParagraafnummer (strParagraph);

			if (domParagraaf) {
				
				strType = domParagraaf.getAttribute ('type');

				if (!strType) {

					switch (domParagraaf.tagName.toLowerCase ()) {
						case "h2": strType = 'hoofdstuk'; break;
						case "h3":
						case "h4": strType = 'paragraaf'; break;
					}
				}
			}
		}

		return Placeholder.replacePlaceholdersInTekst (strTitle, strType, strParagraph);
	}
}
// /////////////////////////////////////////////////////////////////////////// //

class Studietijd {

	static isParagraafMetExtraTijd (domParagraaf) {
		var strStudietijd = domParagraaf.getAttribute ('studietijd');
		return strStudietijd && strStudietijd.includes (EXTRA_STOF);
	}

	/*
	 * Met deze functie wordt het aantal minuten voor een element met studietijd,
	 * studietijd-optelling of studietijd-totaal bepaald.
	 */
	static getStudietijd (domParagraaf) {

		var strStudietijd = domParagraaf.getAttribute ('studietijd');

		if (Studietijd.isParagraafMetExtraTijd (domParagraaf)) {
			strStudietijd = strStudietijd.slice (EXTRA_STOF.length);
		}

		if (strStudietijd && !isNaN (strStudietijd)) {
			return parseInt (strStudietijd);
		}

		return 0;
	}

	/*
	 * Op basis van het aantal minuten wordt een geschreven tekst in (halve) uren,
	 * kwartieren en minuten opgemaakt.
	 */
	static getGeschrevenTijd (intAantalMinuten) {

		var strGeschrevenTijd = "";

		if (isNaN (intAantalMinuten)) {
			return '<span class="melding">\'studietijd\' moet een geheel getal zijn.</span>';
		}
		else {

			if (intAantalMinuten == 0) {
				return '';
			}

			var intAantalUren = (intAantalMinuten - (intAantalMinuten % 60)) / 60;
			intAantalMinuten -= intAantalUren * 60;
			var intAantalHalveUren = ((intAantalMinuten == 30) ? 1 : 0);
			intAantalMinuten -= intAantalHalveUren * 30;
			var intAantalKwartieren = (((intAantalMinuten % 15) == 0) ? intAantalMinuten / 15 : 0);
			intAantalMinuten -= intAantalKwartieren * 15;

			if (intAantalUren > 0) {

				strGeschrevenTijd += intAantalUren;

				if (intAantalHalveUren == 1) {
					strGeschrevenTijd += '½';
				}

				strGeschrevenTijd += ' uur';

				if ((intAantalMinuten > 0) || (intAantalKwartieren > 0)) {
					strGeschrevenTijd += ' en ';
				}
			}
			else if (intAantalHalveUren == 1) {
				return 'een half uur';
			}

			if (intAantalMinuten > 0) {
				strGeschrevenTijd += intAantalMinuten + ((intAantalMinuten == 1) ? ' minuut' : ' minuten');
			}
			else if (intAantalKwartieren > 0) {
				strGeschrevenTijd += intAantalKwartieren + ' kwartier';
			}

			return strGeschrevenTijd;
		}
	}

	static get intToetstijdTotaal () {
		return this.objStudietijdTotaal.intToetstijdTotaal;
	}

	static set intToetstijdTotaal (intToetstijd) {
		this.objStudietijdTotaal.intToetstijdTotaal = intToetstijd;
	}

	static get intExtraTijdTotaal () {
		return this.objStudietijdTotaal.intExtraTijdTotaal;
	}

	static set intExtraTijdTotaal (intExtraTijd) {
		this.objStudietijdTotaal.intExtraTijdTotaal = intExtraTijd;
	}

	static get objStudietijdTotaal () {

		if (!this._objStudietijdTotaal) {

			this._objStudietijdTotaal = {'intToetstijdTotaal': 0, 'intExtraTijdTotaal': 0};

			for (const child of getElementsByNames ('h2,h3,h4')) {

				var blnIsExtraTijd = Studietijd.isParagraafMetExtraTijd (child);
				var intStudietijd = Studietijd.getStudietijd (child);

				if (intStudietijd > 0) {

					if (blnIsExtraTijd) {
						Studietijd.intExtraTijdTotaal += intStudietijd;
					}
					else {
						Studietijd.intToetstijdTotaal += intStudietijd;
					}
				}
			}
		}

		return this._objStudietijdTotaal;
	}

	static resetTotalen () {
		this._objStudietijdTotaal = null;
	}

	get objStudietijd () {

		if (!this._objStudietijd) {
			this._objStudietijd = {'intToetstijd': 0, 'intExtraTijd': 0};
		}

		return this._objStudietijd;
	}

	get intToetstijd () {
		return this.objStudietijd.intToetstijd;
	}
	
	set intToetstijd (intToetstijd) {
		this.objStudietijd.intToetstijd = intToetstijd;
	}

	get intExtraTijd () {
		return this.objStudietijd.intExtraTijd;
	}

	set intExtraTijd (intExtraTijd) {
		this.objStudietijd.intExtraTijd = intExtraTijd;
	}

	get blnIsExtraTijd () {

		if (this.intExtraTijd) {
			return true;
		}
		else {
			false;
		}
	}

	get intStudietijd () {
		return this.intToetstijd + this.intExtraTijd;
	}

	set intStudietijd (intStudietijd) {

		var blnIsExtraTijd = Studietijd.isParagraafMetExtraTijd (this.objParagraaf.domParagraaf);

		if (blnIsExtraTijd) {
			this.intExtraTijd = intStudietijd;
		}
		else {
			this.intToetstijd = intStudietijd;
		}
	}

	getRegel (strClass, strEenheid, intStudietijd) {
		return '<span class="' + strClass + '">Studietijd voor de toetsstof ' + strEenheid + ': ' +
			       Studietijd.getGeschrevenTijd (intStudietijd) +
			   '</span>';
	}

	getSomOfTotaalTekst (strEenheid) {

		var strStudietijdTekst = '';
		var strEenheid;
		var intToetstijd = this.intToetstijd;
		var intExtraTijd = this.intExtraTijd;
		var blnHasToetstijd = intToetstijd;
		var blnHasExtraTijd = intExtraTijd;

		if (!(blnHasToetstijd || blnHasExtraTijd)) {
			return 'Er is geen studietijd vastgesteld voor de stof ' + strEenheid;
		}

		if (blnHasToetstijd) {
			strStudietijdTekst += this.getRegel ('toetsMateriaal', strEenheid, intToetstijd);
		}

		if (blnHasExtraTijd) {
			strStudietijdTekst += (blnHasToetstijd ? '<br>' : '') + this.getRegel ('extraMateriaal', strEenheid, intExtraTijd);
		}

		if (blnHasToetstijd && blnHasExtraTijd) {
			strStudietijdTekst += '<br>' + this.getRegel ('extraMateriaal', strEenheid, intToetstijd + intExtraTijd);
		}

		return strStudietijdTekst;
	}

	berekenTotaalVanStudietijdenInDocument () {
		this.intToetstijd = Studietijd.intToetstijdTotaal;
		this.intExtraTijd = Studietijd.intExtraTijdTotaal;
	}

	get strTotaalTekst () {
		this.berekenTotaalVanStudietijdenInDocument ();
		return this.getSomOfTotaalTekst ('op deze pagina');
	}

	headerIsToegevoegdAanSectie (domElement) {

		let domParent = domElement.parentNode;

		while (domParent) {

			if (domParent.tagName.toLowerCase () === 'body') {
				return false;
			}
			else  if (domParent.id && domParent.id.toLowerCase ().includes (SECTIE)) {
				return true;
			}

			domParent = domParent.parentNode;
		}

		return false;
	}

	berekenSomVanStudietijdenInHuidigeParagraaf () {

		var blnOptellingCompleet = false;
		var blnHuidigeElementGevonden = false;
		var domStart = this.objParagraaf.domParagraaf;

		/*
		 * Er kan alleen een som worden berekend als een hoofdstuk onderliggende (sub-)paragrafen
		 * of als een paragraaf onderliggende subparagrafen kan hebben. Er kan dus geen som worden
		 * berekend voor een subparagraaf (want die heeft geen onderliggende sub-subparagrafen meer).
		 */
		// if (domStart.tagName.toLowerCase () !== 'h4') {

		/*
		 * Er kan alleen een som worden berekend als een hoofdstuk onderliggende (sub-)paragrafen
		 * of als een paragraaf onderliggende subparagrafen kan hebben. Er kan dus geen som worden
		 * berekend voor een subparagraaf (want die heeft geen onderliggende sub-subparagrafen meer).
		 */
		var strParagrafen = '';

		for (let i = +domStart.tagName.charAt (1); i <= 4; i++) {

			if (strParagrafen) {
				strParagrafen += ', ';
			}

			strParagrafen += 'h' + i;
		}

		/*
		 * Omdat de tests met studietijden uitgevoerd worden voordat secties worden toegevoegd, 
		 * wordt hier eerst gecontroleerd of er al secties zijn toegevoegd. In dat geval worden de
		 * op het element volgende h2's, h3's en h4's bekeken. In het andere geval wordt de som 
		 * van de studietijd bepaald van de h2's, h3's en h4's die nog niet aan een sectie zijn
		 * toegevoegd.
		 */
		var arrParagrafen = [];

		if (document.body.querySelectorAll ('div[id^=' + SECTIE + ']').length == 0) {

			var domNext = domStart.nextElementSibling;

			while (domNext && domNext.tagName.toLowerCase () !== domStart.tagName.toLowerCase ()) {

				if (strParagrafen.includes (domNext.tagName.toLowerCase ())) {
					arrParagrafen.push (domNext);
				}

				domNext = domNext.nextElementSibling;
			}

		} 
		else {
			arrParagrafen = document.body.querySelectorAll (strParagrafen);
		}

		for (let i = 0; i < arrParagrafen.length; i++) {

			let domParagraaf = arrParagrafen [i];

			/*
			 * Doorbreek de foreach door de lengte van arrParagrafen af te kappen na het eerste element
			 * dat al eerder is toegevoegd aan een sectie of waarvan de tag gelijk is aan de tag van
			 * het element waarvoor de som van de studietijden moet worden bepaald.
			 */
			if (this.headerIsToegevoegdAanSectie (domParagraaf)
				||
				domParagraaf.tagName.toLowerCase () === domStart.tagName.toLowerCase ()) {
				break;
			}

			var blnIsExtraTijd = Studietijd.isParagraafMetExtraTijd (domParagraaf);
			var intStudietijd = Studietijd.getStudietijd (domParagraaf);
			blnIsExtraTijd ? this.intExtraTijd += intStudietijd : this.intToetstijd += intStudietijd;
		}
	}

	get strSomTekst () {
		this.berekenSomVanStudietijdenInHuidigeParagraaf ();
		var strEenheid = 'in ' + ((this.objParagraaf.strHeader === 'h2') ? 'dit hoofdstuk' : 'deze paragraaf');
		return this.getSomOfTotaalTekst (strEenheid);
	}

	/*
	 * In deze getter wordt de tekst opgemaakt voor een paragraaf waarvoor de studietijd moet
	 * worden getoond (die in dat geval bestaat uit 1 regel).
	 */
	get strEnkeleTekst () {

		this.intStudietijd = Studietijd.getStudietijd (this.objParagraaf.domParagraaf);
		var strSoortStudietijd = (this.blnIsExtraTijd ? 'Studietijd extra stof (facultatief): ' : 'Studietijd toetsstof: ');
		var strGeschrevenTijd = Studietijd.getGeschrevenTijd (this.intStudietijd);

		if (strGeschrevenTijd) {
			var strClass = (this.blnIsExtraTijd ? 'extraMateriaal' : 'toetsMateriaal');
			return '<span class="' + strClass + '">' + strSoortStudietijd + strGeschrevenTijd + '</span>'
		}
	}

	constructor (objParagraaf) {

		this.objParagraaf = objParagraaf;
		var strTekst;

		switch (this.objParagraaf.strStudietijd) {

			case 'totaal':
				strTekst = this.strTotaalTekst;
				break;

			case 'som':
				strTekst = this.strSomTekst;
				break;

			default:
				strTekst = this.strEnkeleTekst;
		}

		if (this.getDOMStudietijd (strTekst)) {
			this.domStudietijd.innerHTML = strTekst;
		}
	}

	/*
	 * Als er nog geen div is aangemaakt, waarin de correcte studietijd wordt getoond,
	 * dan gebeurt dat in de getters.
	 * Daarbij wordt gebruik gemaakt van de setter om de tekst in een div voor de studietijd
	 * te kunnen tonen.
	 * 
	 * Als een tekst wordt meegegeven, wordt de div aangemaakt (get-methode).
	 * Anders wordt alleen een div aangemaakt als er studietijd is opgegeven (de getter).
	 */
	getDOMStudietijd (strTekst) {

		if (strTekst) {
			this.domStudietijd = document.createElement ('div');
		}

		return this.domStudietijd;
	}

	get domStudietijd () {

		if (!this._domTijd) {

			if (this.intStudietijd > 0) {
				this.domStudietijd = document.createElement ('div');
			}
		}

		return this._domTijd;
	}

	set domStudietijd (domStudietijd) {
		var domParagraaf = this.objParagraaf.domParagraaf;
		var strParagraaf = domParagraaf.getAttribute ('paragraph');
		this._domTijd = domStudietijd;
		this._domTijd.classList.add ('blended-tijd');
		this._domTijd.setAttribute ('paragraph', strParagraaf);
		domParagraaf.parentNode.insertBefore (this._domTijd, domParagraaf.nextSibling);
	}

	/*
	 * Test de functie getGeschrevenTijd.
	 */
	static testGetGeschrevenTijd () {

		var objTest = new Test ('getGeschrevenTijd');
		var intTestnummer = 1;
		var strActie = 'Test met verschillende studietijden';
		var arrTestdata = [];

		var arrTijden = [
				{'aantal': 0, 'resultaat': ''},
				{'aantal': 1, 'resultaat': '1 minuut'},
				{'aantal': 2, 'resultaat': '2 minuten'},
				{'aantal': 14, 'resultaat': '14 minuten'},
				{'aantal': 15, 'resultaat': '1 kwartier'},
				{'aantal': 16, 'resultaat': '16 minuten'},
				{'aantal': 29, 'resultaat': '29 minuten'},
				{'aantal': 30, 'resultaat': 'een half uur'},
				{'aantal': 31, 'resultaat': '31 minuten'},
				{'aantal': 44, 'resultaat': '44 minuten'},
				{'aantal': 45, 'resultaat': '3 kwartier'},
				{'aantal': 46, 'resultaat': '46 minuten'},
				{'aantal': 59, 'resultaat': '59 minuten'},
				{'aantal': 60, 'resultaat': '1 uur'},
				{'aantal': 61, 'resultaat': '1 uur en 1 minuut'},
				{'aantal': 62, 'resultaat': '1 uur en 2 minuten'},
				{'aantal': 74, 'resultaat': '1 uur en 14 minuten'},
				{'aantal': 75, 'resultaat': '1 uur en 1 kwartier'},
				{'aantal': 76, 'resultaat': '1 uur en 16 minuten'},
				{'aantal': 89, 'resultaat': '1 uur en 29 minuten'},
				{'aantal': 90, 'resultaat': '1½ uur'},
				{'aantal': 91, 'resultaat': '1 uur en 31 minuten'},
				{'aantal': 104, 'resultaat': '1 uur en 44 minuten'},
				{'aantal': 105, 'resultaat': '1 uur en 3 kwartier'},
				{'aantal': 106, 'resultaat': '1 uur en 46 minuten'},
				{'aantal': 119, 'resultaat': '1 uur en 59 minuten'},
				{'aantal': 120, 'resultaat': '2 uur'},
				{'aantal': 121, 'resultaat': '2 uur en 1 minuut'},
				{'aantal': 122, 'resultaat': '2 uur en 2 minuten'},
				{'aantal': 150, 'resultaat': '2½ uur'},
				{'aantal': 'x', 'resultaat': '<span class="melding">\'studietijd\' moet een geheel getal zijn.</span>'}
			];

		objTest.toonHeader ();

		arrTijden.forEach (objTijd => {
			arrTestdata.push ({'melding': 'Geschreven tijd: ', 'expected': objTijd.resultaat, 'actual': Studietijd.getGeschrevenTijd (objTijd.aantal)});
		});

		objTest.execute (intTestnummer, strActie, arrTestdata);
		objTest.toonFooter ();
	}

	static testAddToTestdata (intTeller, arrTijden, intToetstijd, intExtraTijd, intStudietijd, objParagraaf) {
		arrTijden.push ({'melding': 'Toetstijd ' + intTeller + ': ', 'expected': intToetstijd, 'actual': objParagraaf.objStudietijd.intToetstijd});
		arrTijden.push ({'melding': 'Extra tijd ' + intTeller + ': ', 'expected': intExtraTijd, 'actual': objParagraaf.objStudietijd.intExtraTijd});
		arrTijden.push ({'melding': 'Totale tijd ' + intTeller + ': ', 'expected': intStudietijd, 'actual': objParagraaf.objStudietijd.intStudietijd});
	}

	static testGetTestParagraaf (strTag, intToetstijd, intExtratijd, strStudietijd) {

		var domH = document.createElement (strTag);
		domH.setAttribute ('nummering', 'no');
		domH.setAttribute ('inhoud', 'no');

		if (!strStudietijd) {

			if (intToetstijd) {
				strStudietijd = '' + intToetstijd;
			}
			else {
				strStudietijd = EXTRA_STOF + intExtratijd;
			}
		}

		domH.setAttribute ('studietijd', strStudietijd);
		return domH;
	}

	static testStudietijd () {

		var objTest = new Test ('Studietijd');
		var intTestnummer = 1;
		var strActie = 'Test van de class Studietijd';
		var arrTestdata = [];

		var arrTijden = [];
		var bestaandeToetstijd = 0;
		var bestaandeExtraTijd = 0;

		for (const child of getElementsByNames ('h2,h3,h4')) {

			if (Studietijd.isParagraafMetExtraTijd (child)) {
				bestaandeExtraTijd += Studietijd.getStudietijd (child);
			}
			else {
				bestaandeToetstijd += Studietijd.getStudietijd (child);
			}
		}

		var domTest = document.createElement ('div');
		document.getElementsByTagName ('body') [0].appendChild (domTest);

		var domH1 = Studietijd.testGetTestParagraaf ('h2', 0, 0, 'som');
		var domH2 = Studietijd.testGetTestParagraaf ('h3', 0, 0);
		var domH3 = Studietijd.testGetTestParagraaf ('h2', 0, 0, 'totaal');
		var domH4 = Studietijd.testGetTestParagraaf ('h2', 0, 0, 'totaal');
		var domH5 = Studietijd.testGetTestParagraaf ('h3', 51, 0);
		var domH6 = Studietijd.testGetTestParagraaf ('h3', 0, 9);
		var domH7 = Studietijd.testGetTestParagraaf ('h3', 0, 0, 'som');
		var domH8 = Studietijd.testGetTestParagraaf ('h4', 9, 0);
		var domH9 = Studietijd.testGetTestParagraaf ('h4', 0, 51);

		domTest.appendChild (domH1);
		domTest.appendChild (domH2)
		domTest.appendChild (domH3);
		domTest.appendChild (domH4);
		domTest.appendChild (domH5);
		domTest.appendChild (domH6);
		domTest.appendChild (domH7);
		domTest.appendChild (domH8);
		domTest.appendChild (domH9);

		var objParagraaf = new Paragraaf (domH1);
		Studietijd.testAddToTestdata (1, arrTijden, 0, 0, 0, objParagraaf);

		var objParagraaf = new Paragraaf (domH2);
		Studietijd.testAddToTestdata (2, arrTijden, 0, 0, 0, objParagraaf);

		objParagraaf = new Paragraaf (domH3);
		var intToetstijd = 60 + bestaandeToetstijd;
		var intExtraTijd = 60 + bestaandeExtraTijd;
		var intStudietijd = intToetstijd + intExtraTijd;
		Studietijd.testAddToTestdata (3, arrTijden, intToetstijd, intExtraTijd, intStudietijd, objParagraaf);

		objParagraaf = new Paragraaf (domH4);
		Studietijd.testAddToTestdata (4, arrTijden, intToetstijd, intExtraTijd, intStudietijd, objParagraaf);

		objParagraaf = new Paragraaf (domH5);
		Studietijd.testAddToTestdata (5, arrTijden, 51, 0, 51, objParagraaf);

		objParagraaf = new Paragraaf (domH6);
		Studietijd.testAddToTestdata (6, arrTijden, 0, 9, 9, objParagraaf);

		objParagraaf = new Paragraaf (domH7);
		Studietijd.testAddToTestdata (7, arrTijden, 9, 51, 60, objParagraaf);

		objParagraaf = new Paragraaf (domH8);
		Studietijd.testAddToTestdata (8, arrTijden, 9, 0, 9, objParagraaf);

		objParagraaf = new Paragraaf (domH9);
		Studietijd.testAddToTestdata (9, arrTijden, 0, 51, 51, objParagraaf);

		objTest.toonHeader ();

		arrTijden.forEach (objTijd => {
			arrTestdata.push ({'melding': objTijd.melding, 'expected': objTijd.expected, 'actual': objTijd.actual});
		});

		objTest.execute (intTestnummer, strActie, arrTestdata);
		objTest.toonFooter ();

		Studietijd.resetTotalen ();
		domTest.remove ();
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Paragraaf {

	static get intHoofdstuk () {

		if (!this._intHoofdstuk) {
			this._intHoofdstuk = 0;
		}

		return this._intHoofdstuk;
	}

	static set intHoofdstuk (intHoofdstuk) {
		this._intHoofdstuk = intHoofdstuk;
	}

	static get intParagraaf () {

		if (!this._intParagraaf) {
			this._intParagraaf = 0;
		}

		return this._intParagraaf;
	}

	static set intParagraaf (intParagraaf) {
		this._intParagraaf = intParagraaf;
	}

	static get intSubparagraaf () {

		if (!this._intSubparagraaf) {
			this._intSubparagraaf = 0;
		}

		return this._intSubparagraaf;
	}

	static set intSubparagraaf (intSubparagraaf) {
		this._intSubparagraaf = intSubparagraaf;
	}

	static getParagraaf (strTag) {

		/*
		 * Paragraaf.strParagraaf wordt alleen aangepast als een nieuwe paragraaf is gevonden.
		 * In alle andere gevallen (als er dus geen nieuwe h2, h3 of h4 is gevonden) wordt de
		 * laatst bepaald strParagraaf terug gegeven.
		 */
		switch (strTag) {

			case 'h2':
				Paragraaf.intParagraaf = 0;
				Paragraaf.intSubparagraaf = 0;
				Paragraaf.strParagraaf = 'Hoofdstuk ' + ++Paragraaf.intHoofdstuk;
				break;

			case 'h3':
				Paragraaf.intSubparagraaf = 0;
				Paragraaf.strParagraaf = ((Paragraaf.intHoofdstuk > 0) ? Paragraaf.intHoofdstuk + '.' : '') +
				                         ++Paragraaf.intParagraaf;
				break;

			case 'h4':
				Paragraaf.strParagraaf = (Paragraaf.intHoofdstuk > 0 ? Paragraaf.intHoofdstuk + '.' : '') + 
			    	                     (Paragraaf.intParagraaf > 0 ? Paragraaf.intParagraaf + '.' : '') + 
			                             ++Paragraaf.intSubparagraaf;
				break;
		}

		return Paragraaf.strParagraaf;
	}

	constructor (domParagraaf) {

		this.domParagraaf = domParagraaf;
		var strTag = this.domParagraaf.tagName.toLowerCase ();

		var strType = domParagraaf.getAttribute ('type');

		if (strType) {
			strType = strType.charAt (0).toUpperCase () + strType.substring (1);
		}

		this.domParagraaf.innerHTML = (strType ? strType + ' - ' : '') + this.domParagraaf.innerHTML;

		if (this.domParagraaf.getAttribute ('nummering') !== 'no') {

			var strParagraaf = Paragraaf.getParagraaf (strTag);
			this.domParagraaf.setAttribute ('paragraph', strParagraaf);

			if (!this.domParagraaf.id) {
				this.domParagraaf.id = strParagraaf;
			}

			this.domParagraaf.innerHTML = strParagraaf + ' - ' + this.domParagraaf.innerHTML; 
		}

		this.objStudietijd = new Studietijd (this);
	}

	get strHeader () {
		return this.domParagraaf.tagName.toLowerCase ();
	}

	get strParagraaf () {
		return this.domParagraaf.getAttribute ('paragraph');
	}

	get strStudietijd () {
		return this.domParagraaf.getAttribute ('studietijd');
	}

	get domParagraaf () {

		if (!this._domParagraaf) {
			return null;
		}
		else {
			return this._domParagraaf;
		}
	}

	set domParagraaf (domParagraaf) {
		this._domParagraaf = domParagraaf;
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class ResizeButton {

	toggleTitel () {

		if (objPagina.objPopup.isActief ()) {
			this.domButton.title = 'Verlaat de fullscreen-modus';
		}
		else {
			this.domButton.title = 'Bekijk het materiaal fullscreen';
		}
	}

  toggleFullscreen () {

  	objPagina.activeerSectie (this.domSectie);

  	if (!document.fullscreenElement) {

          objPagina.objPopup.domPopup.requestFullscreen ().catch ((err) => {
              console.log (`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
              return;
          });
  	}
  	else {
  		objPagina.objPopup.returnInhoudNaarSectie (objPagina.domActieveSectie);
  		objPagina.objPopup.domPopup.classList.toggle ('fullscreen-active');
  		document.exitFullscreen ();
  	}
  }

  getResizeAction () {
  	return this.domButton.onclick;
  }

	deactiveerButton () {
		this.domButton.onclick = null;
		this.domButton.classList.remove ('navigatie-active');
	}

	activeerButton () {

		var objButton = this;

		this.domButton.addEventListener (ACTIVEER_LINK, function () {
			objButton.objLink.activeer ();
		});

		this.domButton.addEventListener (DEACTIVEER_LINK, function () {
			objButton.objLink.deactiveer ();
		});

		this.domButton.classList.add ('navigatie-active');
		this.toggleTitel ();
	}

	constructor (domResizeButton, objNavigatie) {

		this.objNavigatie = objNavigatie;
		this.domButton = domResizeButton;
		this.domButton.classList.add ('navigatie-active');
		this.domSectie = this.objNavigatie.objSectie.domSectie

		if (!this.getResizeAction ()) {
			this.objLink = new Link (this.domButton, this.domSectie, this.toggleFullscreen);
			this.activeerButton ();
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Navigatie {

	static get objInhoudsopgave () {
		return this._objInhoudsopgave;
	}

	static set objInhoudsopgave (objInhoudsopgave) {
		this._objInhoudsopgave = objInhoudsopgave;
	}

	voegTitelToe (domSpan, strNaam) {

        switch (strNaam) {
        	case 'vorige': domSpan.title = 'Ga naar de vorige pagina'; break;
        	case 'volgende': domSpan.title = 'Ga naar de volgende pagina'; break;
        	case 'inhoud': domSpan.title = 'Ga naar de inhoudsopgave'; break;
        }
	}

	activeerNavigatieButton (domSpan, objSectie) {

		var objNavigatie = this;

		if (objSectie) {
			var objLink = new Link (domSpan, objSectie.domSectie);
			domSpan.classList.add ('navigatie-active');

			let intIndex = -1;

			for (let i = 0; i < domSpan.classList.length; i++) {

				let strClass = domSpan.classList [i];
				intIndex = strClass.indexOf ('-button');

				if (intIndex != -1) {
					this.voegTitelToe (domSpan, strClass.substring (0, intIndex));
					break;
				}
			}
		}
	}

	deactiveerNavigatieButton (strNaam) {
		var domSpan = this.domNavigatie.querySelector (strNaam + '-button');
		domSpan.classList.remove ('navigatie-active');
		domSpan.onclick = null;
		domSpan.title = '';
	}

	addNavigatieButton (strNaam, objSectie) {
        var domSpan = document.createElement ('span');
        domSpan.classList.add (strNaam + '-button');
        this.activeerNavigatieButton (domSpan, objSectie);
        this.domNavigatie.appendChild (domSpan);
        return domSpan;
	}

	addResizeButton () {
		new ResizeButton (this.addNavigatieButton ('resize', null), this);
	}

	constructor (objSectie, domHeader, objPagina, objVorigeSectie) {

		this.objSectie = objSectie;
		this.domNavigatie = document.createElement ('div');
		this.domNavigatie.classList.add ('navigatie-buttons');

		var arrNamen = ['resize', 'volgende', 'inhoud', 'vorige'];

		arrNamen.forEach (strNaam => {

			switch (strNaam) {
				case 'vorige': this.addNavigatieButton (strNaam, objVorigeSectie); break;
				case 'inhoud': this.addNavigatieButton (strNaam, Navigatie.objInhoudsopgave); break;
				case 'volgende': this.addNavigatieButton (strNaam, null); break;
				case 'resize': this.addResizeButton (); break;
				default: this.addNavigatieButton (strNaam, null);
			}
    	});
	}

	addSectie (strSoort, strSectieID) {

		var objNavigatie = this;

		this.domNavigatie.querySelector ('.' + strSoort + '-button').onclick = function () {
			objNavigatie.navigeerNaarSectie (strSectieID);
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Sectie {

	static get intTeller () {

		if (!Sectie._intTeller) {
			Sectie._intTeller = 1;
		}

		return Sectie._intTeller;
	}

	static set intTeller (intTeller) {
		this._intTeller = intTeller;
	}

	static get domDefaultSectie () {

		var strDefaultSectie = SECTIE + '1';
		var domDefaultSectie = document.getElementById (strDefaultSectie);

		if (!domDefaultSectie) {
			domDefaultSectie = document.creatElement ('div');
			domDefaultSectie.id = strDefaultSectie;
		}

		return domDefaultSectie;
	}

	get strSectieID () {
		return this.domSectie.id;
	}

	constructor (objPagina, domHeader, objParagraaf, objVorigeSectie) {

		this.domSectie = document.createElement ('div');
		this.domSectie.id = SECTIE + Sectie.intTeller++;
		document.body.appendChild (this.domSectie);

		var domContent = document.createElement ('div');
		domContent.classList.add ('content');

		if (domHeader) {
			domContent.append (domHeader);
		}

		var domStudietijd;

		if (objParagraaf) {

			if (objParagraaf.objStudietijd) {
				domStudietijd = objParagraaf.objStudietijd.domStudietijd;
			}
			else {
				domStudietijd = new Studietijd (objParagraaf).domStudietijd;
			}
		}

		if (!domStudietijd) {
			domStudietijd = document.createElement ('div');
			domStudietijd.classList.add ('blended-navigatie');
		}

		domStudietijd.classList.add ('hoofdnavigatie');
		domContent.append (domStudietijd);
		this.objNavigatie = new Navigatie (this, domHeader, objPagina, objVorigeSectie)
		domStudietijd.appendChild (this.objNavigatie.domNavigatie);
		this.domSectie.appendChild (domContent);
	}

	updateSectieGebaseerdOpToegevoegdeSectie (objSectie) {
		var domNextNavigatieButton = this.domSectie.querySelector ('.volgende-button');
		this.objNavigatie.activeerNavigatieButton (domNextNavigatieButton, objSectie);
	}

	addElement (domElement) {
		this.domSectie.firstChild.appendChild (domElement);
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Link {

	static get arrLinks () {

		if (!Link._arrLinks) {
			Link._arrLinks = [];
		}

		return Link._arrLinks;
	}

	static isALink (domLink) {
		return !domLink.parentNode.parentNode.classList.contains ('toggle-div');
	}

	static isInternal (link) {

		var strHREF;

		if (typeof link === 'string') {
			strHREF = link;
		}
		else {
			strHREF = link.getAttribute ('href');
		}

		return strHREF && strHREF.charAt (0) === '#';
	}

	getOmvattendeSectie () {

		let domParent = this.domLink;

		while (domParent) {

			if (domParent.id && domParent.id.includes (SECTIE)) {
				return domParent;
			}

			domParent = domParent.parentNode;
		}
	}

	/*
	 * De links op de pagina worden aangepast, zodat:
	 *
	 * - Een externe link naar een nieuwe pagina wordt geopend in een aparte tab.
	 * - Aan een interne link (met een anker naar een id in de huidige pagina) wordt
	 *   info toegevoegd zodat de link niet wordt geopend in een aparte pagina en
	 *   zodat de back-knop van de browser teruggaat naar de plek van waaruit deze
	 *   link werd aangeroepen.
	 */
	updateLink () {

		if (!this.domLink.onclick) {

			/*
			 * Als het om een interne link gaat, wordt deze aangepast.
			 * Anders gaat het om een externe link en wordt de target zo ingesteld,
			 * dat de link een nieuw tabblad opent.
			 */
			if (Link.isInternal (this.strHREF)) {

				var strID = this.strHREF.slice (1);
				var domTarget = document.getElementById (strID);
				this.domSectie = this.getOmvattendeSectie ();
				var strSectieID = this.domSectie.id;

				/*
				 * Als de link naar een bestaande id verwijst, wordt de interne link daarop
				 * aangepast. Anders wordt in ee log een melding geschreven dat de link niet
				 * geldig is.
				 */
				if (domTarget) {

					var strType = domTarget.getAttribute ('type');
					var strParagraph = domTarget.getAttribute ('paragraph');
					var strTitle = this.domLink.getAttribute ('title');

					/*
					 * Als een titel is opgegeven, dan wordt %t door het type van het 
					 * gelinkte element vervangen en wordt %p door het nummer van de 
					 * gelinkte paragraaf vervangen.
					 *
					 * Het plaatje van de navigatie-buttons moet niet worden vervangen.
					 * (vandaar de tweede voorwaarde).
					 */
					if (strTitle) { // && (!this.domLink.classList.contains ('navigatie-link'))) {
						strTitle = Placeholder.replacePlaceholdersInTitle (strTitle, strType, strParagraph);
						this.domLink.setAttribute ('title', strTitle);
						this.domLink.innerHTML = strTitle;
					}

					/*
					 * Om te zorgen dat de back-knop van de browser teruggaat naar de plek in het document waar op 
					 * de link werd geklikt, wordt deze plek toegevoegd aan de history.
					 * Er geldt één uitzondering: als de link verwijst naar een vorige of volgende paragraaf.
					 */
					this.activeer ();
					/*
					if (!((this.domLink.classList.contains ('navigatie-link'))
						  &&
						  (!strHREF.toLowerCase ().includes ('#h2-inhoud')))) {
						this.domLink.setAttribute ('onclick', 'location.href=\'#' + strIDVanHuidigeParagraaf + '\';');
					}
					*/
				}
				else {
					console.log ('In dit document komt geen anker met #' + strID + ' voor. Controleer deze link');
					this.domLink.innerHTML = 'onbekende link';
					this.domLink.style.color = 'red';
				}
			}

			/*
			 * Een externe link wordt geopend in een nieuw tabblad.
			 */
			else {

				if (this.domLink.tagName.toLowerCase () == 'a') {
					this.domLink.setAttribute ('target', '_blank');
				}
			}
		}
	}

	static updateLinks () {

		Link.arrLinks.forEach (objLink => {
			objLink.updateLink ();
		});
	}

	navigeer () {

		if (objPagina.objPopup.isActief ()) {
			objPagina.objPopup.activeerSectie (this.domSectie);
		}

		location.href = this.strHREF;
		objPagina.activeerSectie (this.domSectie);
	}

	deactiveer () {
		this.domLink.classList.toggle ('active-link');
		this.domLink.onclick = null;
	}

	activeer () {

		var objLink = this;
		this.domLink.classList.toggle ('active-link');

		this.domLink.onclick = function () {

			if (objLink.fnExtraClickFunctie) {
				objLink.fnExtraClickFunctie ();
			}

			objLink.navigeer ();
		};
	}

	constructor (domLink, domSectie, fnExtraClickFunctie) {

		this.domLink = domLink;
		this.strHREF = domLink.getAttribute ('href');

		if (!this.strHREF) {

			if (domSectie) {
				this.strHREF = '#' + domSectie.id;
			}
			else {
				this.strHREF = '';
			}
		}

		if ((domLink.tagName.toLowerCase () === 'a')
		    &&
		    Link.isInternal (domLink)) {
			domLink.removeAttribute ('href');
		}

		this.domSectie = domSectie;
		this.fnExtraClickFunctie = fnExtraClickFunctie;
		Link.arrLinks.push (this);

		if (domSectie) {
			this.activeer ();
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Pagina {

	get objPopup () {
		return this._objPopup;
	}

	set objPopup (objPopup) {
		this._objPopup = objPopup;
	}

	get arrSecties () {

		if (!this._arrSecties) {
			this._arrSecties = [];
		}

		return this._arrSecties;
	}

	get arrParagrafen () {

		if (!this._arrParagrafen) {
			this._arrParagrafen = [];
		}

		return this._arrParagrafen;
	}

	constructor () {

		this.objPopup = new Popup ();
		this.objBlendedElements = new BlendedElements ();
		this.objInhoudsopgave = new Inhoudsopgave ();
		this.addBlendedElement (this.objInhoudsopgave);
		this.objVideoLists = new VideoLists ();

		this.objVideoLists.arrVideoLists.forEach (objVideoList => {
			this.addBlendedElement (objVideoList);
		});
	}

	get domActieveSectie () {

		if (!this._domActieveSectie) {
			this.domActieveSectie = Sectie.domDefaultSectie;
		}

		return this._domActieveSectie;
	}

	set domActieveSectie (domSectie) {
		this._domActieveSectie = domSectie;
	}

	analyseerElement (domElement, objParagraaf) {

		var strTag = domElement.tagName.toLowerCase ();

		switch (strTag) {

			case 'h2':
			case 'h3':
			case 'h4':

				if (domElement.getAttribute ('navigatie') === 'yes') {
					console.log ('%canalyseerElement - h2, h3 of h4 met navigatie gevonden op dieper niveau (' +
					             domElement.outerHTML + ')', 'color: red;')
				}

				if (!objParagraaf) {
					objParagraaf = new Paragraaf (domElement);
				}

				this.addParagraaf (domElement, Paragraaf.intHoofdstuk);
				break;

			case 'a':

				if (Link.isALink (domElement)) {
					var domSectie = this.arrSecties [this.arrSecties.length - 1].domSectie;
					Link.arrLinks.push (new Link (domElement));
				}

				break;

			case 'pre':

				if (domElement.getAttributeNames ().length === 0) {
					domElement.setAttribute (UITWERKING, 'toggle');
				}

			case 'div':

				if (domElement.id.includes (INHOUDSOPGAVE)) {
					this.updateNavigatieGebaseerdOpInhoudsopgave (this.arrSecties [this.arrSecties.length - 1]);
				}
				else {
					this.objBlendedElements.addElement (domElement);
				}

				break;
		}

		for (const domChild of domElement.querySelectorAll(":scope > *")) {
			this.analyseerElement (domChild);
		}
	}

	isSectieOfPopup (domElement) {

		if (!domElement.id) {
			return false;
		}
		else {
			return domElement.id.includes (SECTIE) || domElement.id === 'popup'
		}
	}

	/**
	 * Bepaal of domElement kan worden overgeslagen (omdat het alleen maar commentaar
	 * of whitespace bevat).
	 *
	 * @param domElement Een element uit de DOM.
	 * @return 			 true als domElement voldoet aan de volgende voorwaarden:
	 *
	 *					 1) Een #text-element dat alleen whitespace bevat.
	 *					 2) Een comment-element.
	 *
	 *					 Anders natuurlijk false.
	 */
	bevatAlleenWhitespace (domElement) {
		return !(/[^\t\n\r ]/.test (domElement.textContent));
	}

	kanWordenGenegeerd (domElement) {
		return ((domElement.nodeType === 8) // Een comment-element.
				||
				((domElement.nodeType === 3) // Een #text-element
				 && 
				 this.bevatAlleenWhitespace (domElement)));
	}


	addSecties () {

		var strTag = 'text';
		var domElement = document.body.firstChild;

		while (this.kanWordenGenegeerd (domElement)) {
			domElement.remove ();
			domElement = document.body.firstChild;
		}

		if (domElement.nodeName !== '#text') {
			strTag = document.body.firstElementChild.tagName.toLowerCase ();
		}

		if (!'h2,h3,h4'.includes (strTag) && (this.arrSecties.length == 0)) {
			this.arrSecties.push (new Sectie (this));
		}

		while (domElement && !this.isSectieOfPopup (domElement)) {

			if (domElement.nodeName !== '#text') {

				var strNavigatie = domElement.getAttribute ('navigatie');
				strTag = domElement.tagName.toLowerCase ();
				var strID = domElement.id;
				var objParagraaf = null;

				if ('h2,h3,h4'.includes (strTag)) {

					if (this.arrSecties.length == 0) {
						domElement.setAttribute ('navigatie', 'yes');
					}

					if (domElement.getAttribute ('navigatie') == 'yes') {

						var objSectie;
						var objVorigeSectie = null;
						objParagraaf = new Paragraaf (domElement);

						if (this.arrSecties.length > 0) {
							objVorigeSectie = this.arrSecties [this.arrSecties.length - 1];
						}

						objSectie = new Sectie (this, domElement, objParagraaf, objVorigeSectie);

						if (this.arrSecties.length > 0) {
							this.arrSecties [this.arrSecties.length - 1].updateSectieGebaseerdOpToegevoegdeSectie (objSectie);
						}

						this.arrSecties.push (objSectie);
						domElement.removeAttribute ('navigatie');
					}
				}
			}

			/*
			 * Alle elementen (inclusief een text-element (een tekst zonder <p>) op het hoogste niveau)
			 * worden gekopieerd naar de sectie. Dat gebeurt niet met elementen die al eerder naar een sectie
			 * zijn gekopieerd.
			 */
			if ((domElement.nodeName === '#text')
				||
				!domElement.parentNode.parentNode.id.includes (SECTIE)) {

				if (this.kanWordenGenegeerd (domElement)) {
					domElement.remove ();
				}
				else {
					this.arrSecties [this.arrSecties.length - 1].addElement (domElement);
				}
			}

			if (domElement.nodeName !== '#text') {
				this.analyseerElement (domElement, objParagraaf);
			}

			domElement = document.body.firstChild;
		}
	}

	activeerSectie (domSectie) {
		this.domActieveSectie = domSectie;
	}

	addParagraaf (domParagraaf, intHoofdstuk) {

		if (domParagraaf.id !== 'h2-inhoud') {
			var domSectie = this.arrSecties [this.arrSecties.length - 1].domSectie;
			this.objInhoudsopgave.addParagraaf (domParagraaf, domSectie, intHoofdstuk);
		}
	}

	addVideoToList (strParagraph, strTitle, strLink) {
		this.objVideoLists.addVideoToList (strParagraph, strTitle, strLink);
	}

	addBlendedElement (objBlendedElement) {
		this.objBlendedElements.add (objBlendedElement);
	}

	embedContent () {
		this.objBlendedElements.embedContent ();
	}

	updateLinks () {
		Link.updateLinks ();
	}

	updateNavigatieGebaseerdOpInhoudsopgave (objInhoudsopgave) {

		Navigatie.objInhoudsopgave = objInhoudsopgave;

		this.arrSecties.forEach (objSectie => {
			var domButton = objSectie.objNavigatie.domNavigatie.querySelector ('.inhoud-button');
			objSectie.objNavigatie.activeerNavigatieButton (domButton, objInhoudsopgave);
		});
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Popup {

	get intNumberOfPages () {
		return document.body.querySelectorAll ('div[id^=' + SECTIE + ']').length;
	}

	get domSelect () {
		return this.domPopup.querySelector ('.navigatie select');
	}

	setWidthOption (domSelect, strWidthID) {

		var domOptionToBeSelected = domSelect.querySelector ('#' + strWidthID);

    if (domOptionToBeSelected) {
      domOptionToBeSelected.selected = 'true';
    }
	}

  addWidthOption (width) {

  	var strPX = width === '100%' ? '' : 'px';

  	if (width === '100%' || (width < (screen.width - 100))) {
  		var domOption = document.createElement ('option');
  		domOption.id = 'w' + (width === '100%' ? '100' : width) + strPX;
  		domOption.value = width + strPX;
  		domOption.innerHTML = width + strPX;

  		if (width === '100%') {
  			domOption.selected = true;
  		}

  		return domOption;
  	}

  	return null;
  }

	addWidthOptions (domSelect) {
		domSelect.innerHTML = '';
		domSelect.append (this.addWidthOption ('100%'));
		domSelect.append (this.addWidthOption (800));
		domSelect.append (this.addWidthOption (1280));
		domSelect.append (this.addWidthOption (1440));
		domSelect.disabled = domSelect.childElementCount === 1;
	}

	getWidthID (strWidthValue) {

		var strWidthID;

		if (strWidthValue) {

			let strHonderdProcent = '100%';
			let intLengteVanHonderdProcent = strHonderdProcent.length;
			strWidthID = 'w' + strWidthValue;

			if (strWidthValue === strHonderdProcent) {
				strWidthID = strWidthID.substring (0, intLengteVanHonderdProcent);
			}
		}
		else {
			strWidthID = Cookie.get ('popup-width');
		}

		return strWidthID ? strWidthID : 'w100';
	}

  changeWidth (domSelect, strWidthValue) {

  	if (this.isActief ()) {
  		var strWidthID = this.getWidthID (strWidthValue);
	 		this.addWidthOptions (domSelect);
    	var domRoot = document.querySelector (':root');
    	var domRootStyle = getComputedStyle (domRoot);
    	domRoot.style.setProperty ('--width-popup', strWidthValue);
    	Cookie.set ('popup-width', strWidthID);
  		this.setWidthOption (domSelect, strWidthID);
    }
  }

	bevatNavigatieButtons () {
		return this.domPopup.querySelector ('.navigatie-buttons');
	}

	wordtGetoondInFullscreen () {
		return document.fullscreenElement
		       ||
		       ((window.innerWidth === screen.width) && (window.innerHeight === screen.height));
	}

	toggleMoetWordenToegepast (blnFullscreenIsChecked) {

		if (blnFullscreenIsChecked) {
			return !this.isActief () && !this.bevatNavigatieButtons () && this.wordtGetoondInFullscreen ();
		}
		else {
			return this.isActief () && this.bevatNavigatieButtons () && !this.wordtGetoondInFullscreen ();
		}
	}

	toggleResizeButton (blnVisibility) {

		var domResizeButton = this.domPopup.querySelector ('.resize-button');
		var domMaximizedByBrightspace = this.domPopup.querySelector ('.maximized-by-brightspace');
		var domPager = this.domPopup.querySelector ('.pagina-nummering');
		var event;

		if (blnVisibility) {
			domResizeButton.classList.add ('navigatie-active');
			domResizeButton.onhover = null;
			event = activeerLinkEvent;
			domResizeButton.classList.remove ('zichtbaar');
			domResizeButton.onmouseenter = null;
			domResizeButton.onmouseleave = null;
			domResizeButton.title = 'Verlaat de fullscreen-modus';
		}
		else {
			domResizeButton.classList.remove ('navigatie-active');
			domResizeButton.title = 'Kies bovenaan voor "Exit Fullscreen"';

			domResizeButton.onmouseenter = function () {
				domMaximizedByBrightspace.classList.add ('zichtbaar');
				domPager.classList.remove ('zichtbaar');
			}

			domResizeButton.onmouseleave = function () {
				domMaximizedByBrightspace.classList.remove ('zichtbaar')
				domPager.classList.add ('zichtbaar');
			}

			event = deactiveerLinkEvent;
		}

		domResizeButton.dispatchEvent (event);

	}

	toggleMinimizeElements () {

		var arrClasses = this.domPopup.querySelector ('.close-button').classList;

		if (this.blnIsActivatedByBrightspace) {
			arrClasses.add ('popup-by-brightspace');
			this.toggleResizeButton (false);
		}
		else {
			arrClasses.remove ('popup-by-brightspace');
			this.toggleResizeButton (true);
		}
	}

	returnInhoudNaarSectie (domSectie) {

		var domContent = this.domPopup.querySelector ('.content');
		var domButtons = this.domPopup.querySelector ('.navigatie-buttons');
		this.toggleResizeButton (true);

		if (domContent) {
			domContent.querySelector ('.hoofdnavigatie').append (domButtons);
			objPagina.domActieveSectie.append (domContent);
		}

		this.actieveSectie = null;
		domButtons.querySelector ('.resize-button').title = 'Bekijk het materiaal fullscreen';
	}

	verplaatsInhoudNaarPopup (domSectie) {
		var domButtons = domSectie.querySelector ('.navigatie-buttons');
		this.domPopup.querySelector ('.navigatie').append (domButtons);
		this.toggleMinimizeElements (false);
		var domContent = domSectie.querySelector ('.content');
		this.domPopup.append (domContent);
	}

	activeerSectie (domSectie) {

		if (this.domPopup.querySelector ('.content')) {
			this.returnInhoudNaarSectie (this.domActieveSectie);
		}

		this.verplaatsInhoudNaarPopup (domSectie);
		this.domPopup.querySelector ('.close-button').onclick = this.domPopup.querySelector ('.resize-button').onclick;

		objPagina.activeerSectie (domSectie);
		this.actieveSectie = domSectie;
		this.domPopup.querySelector ('.pagina-nummering').innerHTML = 'Pagina ' 
		                                                        + domSectie.id.substring (SECTIE.length) + '/' +
		                                                        this.intNumberOfPages;
	}

	isActief () {
		return this.domPopup.classList.contains ('fullscreen-active');
	}

  togglePopup () {

  	if (this.toggleMoetWordenToegepast (true)) {

  		if (!document.fullscreenElement && (window.innerWidth === screen.width) && (window.innerHeight === screen.height)) {
  			this.blnIsActivatedByBrightspace = true;
  		}
  		else {
  			this.blnIsActivatedByBrightspace = false;
  		}

  		this.activeerSectie (objPagina.domActieveSectie);
			this.domPopup.classList.toggle ('fullscreen-active');
			this.changeWidth (this.domSelect, this.domSelect.value);
  	}
  	else if (this.toggleMoetWordenToegepast (false)) {
  		this.returnInhoudNaarSectie (objPagina.domActieveSectie);
			this.domPopup.classList.toggle ('fullscreen-active');
  	}
  }

	getDOMWidthSpan () {

		var objPopup = this;

		var domWidthSpan = document.createElement ('span');
		var domSelect = document.createElement ('select');
		domSelect.title = 'width';
		domSelect.id = 'width';

		domSelect.onchange = function () {
			objPopup.changeWidth (this, this.value);
		}

		domWidthSpan.append (domSelect);
    return domWidthSpan;
	}

	addPopup () {

		this.domPopup = document.createElement ('div');
		this.domPopup.id = 'popup';
		document.getElementsByTagName ('body') [0].appendChild (this.domPopup);

		var domMinimizeByBrightspace = document.createElement ('div');
		domMinimizeByBrightspace.classList.add ('maximized-by-brightspace');
		this.domPopup.append (domMinimizeByBrightspace);

		var domTopBar = document.createElement ('div');
		domTopBar.classList.add ('top-bar');
		var domPagina = document.createElement ('div');
		domPagina.classList.add ('pagina-nummering');
		domPagina.innerHTML = 'Pagina ' + this.intNumberOfPages;
		domTopBar.append (domPagina);
		this.domPopup.appendChild (domTopBar);

		var domNavigatie = document.createElement ('div');
		domNavigatie.classList.add ('navigatie');
		domNavigatie.append (this.getDOMWidthSpan ());
		this.domPopup.appendChild (domNavigatie);

		var domCloseButton = document.createElement ('div');
		domCloseButton.classList.add ('close-button');
		var domCloseCharacter = document.createElement ('span');
		domCloseCharacter.innerHTML = '&times;';
		domCloseButton.appendChild (domCloseCharacter);
		this.domPopup.appendChild (domCloseButton);
  }

	constructor () {

		var objPopup = this;

		this.addPopup ();

		window.onresize = function () {
			objPopup.togglePopup ();
			objPopup.changeWidth (objPopup.domSelect, objPopup.domSelect.value);
		};
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Observable {

	constructor () {
		this.arrObservers = [];
		this.blnHasChanged = false;
	}

	addObserver (objObserver) {
		this.arrObservers.push (objObserver);
	}

	deleteObserver (objObserver) {
		this.arrObservers.splice (this.arrObservers.indexOf (objObserver), 1); 
	}

	deleteObservers () {
		this.arrObservers = [];
	}

	countObservers () {
		return this.arrObservers.length;
	}

	notifyObservers (data) {

		if (this.hasChanged ()) {

			this.arrObservers.forEach (objObserver => {
				objObserver.update (this, data);
			});
		}

		this.clearChanged ();
	}

	hasChanged () {
		return this.blnHasChanged;
	}

	setChanged (blnHasChanged) {

		if (typeof blnHasChanged === 'boolean') {
			this.blnHasChanged = blnHasChanged;
		}
		else {
			this.blnHasChanged = true;
		}
	}

	clearChanged () {
		this.setChanged (false);
	}
}

function convertValue (value) {

	if ((value === 'true') || (value === 'false')) {
		value = value === 'true';
	}

	if (typeof value === 'boolean') {
		return value;
	}

	if ((typeof value === 'number') && (!Number.isNaN (value))) {
		return +value;
	}
	else {
		return value;
	}
}

function testConvertValue () {

	var objTest = new Test ('convertValue');
	objTest.toonHeader ();

	var intTestnummer = 1;
	var strActie = 'convert boolean en number en behoud string';
	var arrTestdata = [
			{'melding': 'typeof \'true\'', 'expected': 'boolean', 'actual': typeof convertValue ('true')},
			{'melding': '\'true\'', 'expected': true, 'actual': convertValue ('true')},
			{'melding': 'typeof true', 'expected': 'boolean', 'actual': typeof convertValue (true)},				
			{'melding': 'true', 'expected': true, 'actual': convertValue (true)},
			{'melding': 'typeof \'false\'', 'expected': 'boolean', 'actual': typeof convertValue ('true')},
			{'melding': '\'false\'', 'expected': false, 'actual': convertValue ('false')},
			{'melding': 'typeof false', 'expected': 'boolean', 'actual': typeof convertValue (false)},				
			{'melding': 'false', 'expected': false, 'actual': convertValue (false)},
			{'melding': 'typeof 15', 'expected': 'number', 'actual': typeof convertValue (15)},
			{'melding': '15', 'expected': 15, 'actual': convertValue (15)},
			{'melding': 'typeof \'15\'', 'expected': 'string', 'actual': typeof convertValue ('15')},				
			{'melding': 'true', 'expected': '15', 'actual': convertValue ('15')},
		];
	objTest.execute (intTestnummer, strActie, arrTestdata);

	objTest.toonFooter ();
}

// /////////////////////////////////////////////////////////////////////////// //

class Cookie {

	/*
	 * Geeft de cookie met key de waarde in value en past daarop meegegeven opties toe.
	 */
	static set (key, value, options) {

		/*
		 * Als de cookie moet verlopen (verwijderd moet worden), wordt de max-age
		 * verwijderd krijgt expires de waarde van gisteren.
		 */
		let intAantalSeconden = 31 * 24 * 60 * 60;

		if (!options) {
			options = {'max-age': intAantalSeconden};
		}

		if (!options.expires) {
			options ['max-age'] = options ['max-age'] || intAantalSeconden;
		}

		options.path = '/';
		options.domain = 'brightspace.hhs.nl';
		options.samesite = 'none';
		options.secure = true;

		let updatedCookie = encodeURIComponent ('kb-' + key) + "=" + encodeURIComponent (value);

	  	for (let optionKey in options) {

			updatedCookie += "; " + optionKey;
	    	let optionValue = options[optionKey];
	    
	    	if (optionValue !== true) {
	    		updatedCookie += "=" + optionValue;
	    	}
	  	}

	  	document.cookie = updatedCookie;
	}

	/*
	 * Geeft de waarde van de cookie met key terug (of undefined als de cookie niet bestaat).
	 */
	static get (key) {

		let matches = document.cookie.match (
			new RegExp (
    			"(?:^|; )" + ('kb-' + key).replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  			)
  		);

		return matches ? convertValue (decodeURIComponent (matches [1])) : undefined;
	}

	/* 
	 * Verwijder de cookie met de meegegeven key.
	 */
	static delete (key) {
  		Cookie.set ('kb-' + key, '', {'expires': new Date (Date.now() - 24 * 60 * 60 * 1000).toUTCString ()});	
	}

	static test () {

		var objTest = new Test ('Cookie');
		objTest.toonHeader ();

		if (strRootDir.substring (0, 4) === 'file') {
			console.log ('\u274C Het is niet mogelijk om Cookies lokaal te testen. Dat kan alleen op de server');
		}
		else {

			var intTestnummer = 1;
			Cookie.set ('testcookie', 'x');
			var strActie = 'Cookie.set (\'kb-testcookie\', \'x\')';
			var arrTestdata = [{'melding': 'Waarde van de testcookie', 'expected': 'x', 'actual': Cookie.get ('testcookie')}];
			objTest.execute (intTestnummer, strActie, arrTestdata);

			var intTestnummer = 2;
			Cookie.set ('testcookie', 'y');
			var strActie = 'Cookie.set (\'kb-testcookie\', \'y\')';
			var arrTestdata = [{'melding': 'Waarde van de testcookie', 'expected': 'y', 'actual': Cookie.get ('testcookie')}];
			objTest.execute (intTestnummer, strActie, arrTestdata);

			var intTestnummer = 3;
			Cookie.delete ('testcookie');
			var strActie = 'Cookie.delete (\'kb-testcookie\')';
			var arrTestdata = [{'melding': 'Waarde van de testcookie', 'expected': undefined, 'actual': Cookie.get ('testcookie')}];
			objTest.execute (intTestnummer, strActie, arrTestdata);
		}

		objTest.toonFooter ();
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Schuifje extends Observable {

	constructor (domParent, objTeksten, strType) {

		/*
		 * objStatus is niet alleen Observable (als de status van waarde verandert,
		 * moeten alle schuifjes naar de nieuwe stand), maar ook Observer (de waarde
		 * van Status moet veranderen als één van de schuifjes van waarde verandert).
		 */
		super ();
		var objSchuifje = this;
		this.objTeksten = objTeksten;

		var domSetup = domParent.querySelector ('.' + strType + '-setup');

		if (!domSetup) {
			domSetup = document.createElement ('div');
			domSetup.classList.add (strType + '-setup');
			domParent.insertBefore (domSetup, domParent.firstChild);
		}

		this.domTekst = document.createElement ('div');
		this.domTekst.classList.add (strType + '-setup-tekst');
		domSetup.appendChild (this.domTekst);

		var domCheckbox = document.createElement ('div');
		domCheckbox.classList.add (strType + '-setup-checkbox');
		domSetup.appendChild (domCheckbox);

		this.domCheckbox = document.createElement ('img');

    	this.domCheckbox.addEventListener ('click', function ()  {
    		objSchuifje.setChanged ();
    		objSchuifje.notifyObservers (objSchuifje.domTekst.innerHTML === objSchuifje.objTeksten.checked);
    	});

		domCheckbox.appendChild (this.domCheckbox);
	}

	setTekst (blnStatus) {
		this.domTekst.innerHTML = (blnStatus ? this.objTeksten.checked : this.objTeksten.unchecked);
	}

	setCheckbox (blnStatus) {
		var mediaDir = addSlashIfNeeded ('media/');
		var strSrc = strRootDir + mediaDir + 'Algemeen - ' + (blnStatus ? 'Checked' : 'Unchecked') + '.gif';
		this.domCheckbox.src = '';
		this.domCheckbox.src = strSrc;
	}

	update (objObservable, blnStatus) {
		this.setTekst (blnStatus);
		this.setCheckbox (blnStatus);
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Status extends Observable {

	setChanged (blnOriginal) {

		if (this.blnStatus != blnOriginal) {
			super.setChanged ();
		}
	}

	getStatus () {

		var blnStatus = this.blnStatus;

		if (typeof blnStatus !== 'boolean') {

			blnStatus = Cookie.get (this.strCookieKey);

			if (typeof blnStatus !== 'boolean') {
				blnStatus = this.blnDefaultStatus;
			}
		}

		this.setChanged (blnStatus);
		return blnStatus;
	}

	setStatus (blnValue) {

		var blnOriginalStatus = this.blnStatus;

		if (typeof blnValue === 'boolean') {
			this.blnStatus = blnValue;
		}
		else {
			this.blnStatus = this.blnDefault;
		}

		Cookie.set (this.strCookieKey, this.getStatus (), this.objCookieOptions);
		this.setChanged (blnOriginalStatus);
		this.notifyObservers ();
	}

	/*
	 * Status heeft zich bij elk gekoppeld Schuifje geregistreerd als Observer.
	 * Als één van deze gekoppelde Schuifjes (die zich weer als Observer hebben 
	 * geregistreerd bij Status) nu van waarde verandert, schuiven alle andere
	 * Schuifjes die zijn gekoppeld aan deze status mee. Update zorgt er dus
	 * voor dat alle Schuifjes mee-toggelen (van true naar false of andersom)
	 * als met de muis wordt geklikt op één van de schuifjes.
	 */
	notifyObservers () {
		super.notifyObservers (this.getStatus ());
	}

	update () {
		this.setStatus (!this.getStatus ());
		this.notifyObservers (this.getStatus ());
	}

	/*
	 * Alle Schuifjes kunnen in één keer als Observer worden geregistreerd bij Status.
	 */
	addObservers (arrSchuifjes) {

		arrSchuifjes.forEach (objSchuifje => {
			this.addObserver (objSchuifje);
		});
	}

	/*
	 * Het Schuifje registreert zich niet alleen als Observer bij de gekoppelde Status,
	 * maar deze Status registreert zich ook als Observer bij het Schuifje. Hiermee
	 * realiseren we dat alle Schuifjes meeveranderen als er met de muis wordt geklikt
	 * op één van de geregistreerde Schuifjes.
	 */
	addObserver (objObserver) {

		if (typeof objObserver.addObserver === 'function') {
			objObserver.addObserver (this);
		}

		super.addObserver (objObserver);
	}

	/*
	 * Met super () wordt de Status voorbereid om als Observable te kunnen functioneren.
	 * Daarna worden de basisgegevens toegevoegd, die nodig zijn om de status op te slaan
	 * in document.cookies.
	 */
	constructor (blnDefaultStatus, strCookieKey, objCookieOptions) {
		super ();
		this.blnDefaultStatus = blnDefaultStatus;
		this.strCookieKey = strCookieKey;
		this.objCookieOptions = objCookieOptions || {'max-age': 31 * 24 * 60 * 60};
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Test {

	static getDefaultSetupStatus () {

		if (strRootDir.substring (0,4) == 'file') {
			return true;
		}
		else {
			return false;
		}
	}

	static get blnTestsShouldBeExecuted () {

		if (!this.objStatus) {

			/*
			 * Als nog geen Status-object is aangemaakt, dan gebeurt dat alsnog. Om dat goed te kunnen
			 * doen, worden ook de Schuifjes toegevoegd aan de DOM-sections met de class 'test-instellingen'.
			 */
			var blnDefault = Test.getDefaultSetupStatus ();
			var strKey = 'execution-of-tests';
			var objOptions = {'max-age': 62 * 24 * 60 * 60};
			this.objStatus = new Status (blnDefault, strKey, objOptions);

			var arrSchuifjes = [];
			var strClass = 'test-instellingen';
			var objTeksten = {'checked': 'Tests worden uitgevoerd', 'unchecked': 'Er wordt niet getest'};
			var strType = TEST;

			for (const domParent of getElementsByNames (strClass)) {
				arrSchuifjes.push (new Schuifje (domParent, objTeksten, strType));
			}

			this.objStatus.addObservers (arrSchuifjes);
			this.objStatus.notifyObservers ();
		}

		return this.objStatus.getStatus ();
	}

	constructor (strMethodeOfClass) {
		this.strMethodeOfClass = strMethodeOfClass;
	}

    toonHeader () {
    	console.log ('\n\u26F6 Tests voor methode of Class \'' + this.strMethodeOfClass + '\'');
    }

    toonFooter () {
    	console.log ('\u26F6 Einde van de test van methode of Class \'' + this.strMethodeOfClass + '\'\n\n');
    }

	static getCSS (blnGeslaagd) {

		if (blnGeslaagd) {
			return 'color: green;';
		}
		else {
			return 'background-color: yellow; color: red;';
		}
	}

	execute (intTestnummer, strActie, arrTestdata, toBeLogged = true) {

		let strTestnummer = ((intTestnummer < 10) ? '00' : ((intTestnummer < 100) ? '0' : '')) + intTestnummer;
		let strResultaat = '';

		if (arrTestdata) {

			let blnTestSlaagt = true;
			let arrResultaten = [];

			arrTestdata.forEach (objTestdata => {

				let strMelding = objTestdata.melding;
				let strExpected = objTestdata.expected;
				let strActual = objTestdata.actual
				let strVergelijking = '\u274C           %c' + strMelding + ': ' + strActual + ' (expected: ' + strExpected + ')';
				var strOpmaak = Test.getCSS (true);

				if (strActual !== strExpected) {
					strOpmaak = Test.getCSS (false);
					blnTestSlaagt = false;
				}
				
				arrResultaten.push ([strVergelijking, strOpmaak]);
			});

			if (blnTestSlaagt) {
				strResultaat = '\u2705 Testcasus ' + strTestnummer + ' slaagt (' + strActie + ').'
				if (toBeLogged) console.log ('%c' + strResultaat, Test.getCSS (true));	
			}
			else {

				var strHeader = '\u274C Testcasus ' + strTestnummer + ' faalt (' + strActie + ').';
				if (toBeLogged) console.log (strHeader);
				strResultaat += strHeader;

				arrResultaten.forEach (domResultaat => {
					if (toBeLogged) console.log (domResultaat [0], domResultaat [1]);
					strResultaat += '\n' + domResultaat [0];
				});
			}
		}

		return strResultaat;
	}

	/*
	 * Hieronder wordt de Class Test getest.
	 */
	static testFalen (objTest, intTestNummer) {

		/*
		 * Er wordt eerst een test uitgevoerd die tot falen heeft geleid (getest ≠ Getest).
		 * Het resultaat van deze test wordt niet in de console getoond, maar wordt in 
		 * strResultaat gestopt.
		 */
		var strActie = 'vergelijking met ongelijke strings (op hoofdletters afwijkend)';
		var arrTestdata = [{ 'melding': 'Gefaald', 'expected': 'Getest', 'actual': 'getest'}];
		var strResultaat = objTest.execute (999, strActie, arrTestdata, false).toLowerCase ();

		/*
		 * Vervolgens wordt gecontroleerd of de test hierboven inderdaad leidt tot het gewenste
		 * resultaat; namelijk tot een gefaalde test met bijbehorende uitvoer (die nu wel in de
		 * console wordt getoond).
		 */
		var strExpected = '\u274C testcasus 999 faalt (' + strActie + ').\n\u274C           %cgefaald: getest (expected: getest)';
		strExpected = strExpected.toLowerCase ();
		arrTestdata = [{ 'melding': strActie, 'expected': strExpected, 'actual': strResultaat }];
		objTest.execute (intTestNummer, strActie, arrTestdata);
	}

	static test () {

		var objTest = new Test ('Test');
		objTest.toonHeader ();

		var intTestnummer = 1;
		var strActie = 'vergelijking van twee identieke booleans';
		var arrTestdata = [
			{ 'melding': 'Test 1 moet slagen', 'expected': true, 'actual': true },
			{ 'melding': 'Test 3 moet slagen', 'expected': 'getest', 'actual': 'getest' }
		];
		objTest.execute (intTestnummer, strActie, arrTestdata);

		Test.testFalen (objTest, 2);

		intTestnummer = 3;
		arrTestdata [1] = { 'Melding': 'Test 2', 'Expected': 'getest', 'Actual': 'getest' };
		strActie = 'vergelijking van twee identieke strings';
		objTest.execute (intTestnummer, strActie, arrTestdata); 

		objTest.toonFooter ();
	}
}

// /////////////////////////////////////////////////////////////////////////// //


// /////////////////////////////////////////////////////////////////////////// //

/*
 * Alle wrappers krijgen eerst een id die bestaat uit de relevante constante
 * (MEDIASITE, UITWERKING etc., zoals hierboven gedefinieerd), gevolgd door een 
 * een '-' en een teller (waarin is bijgehouden in welke volgorde de wrappers
 * op de pagina staan).
 * 
 * Voor het streepje staat dus het type van de wrapper.
 */
function getTypeBasedOnElementID (strBlendedID) {
	return strBlendedID.substr (0, strBlendedID.lastIndexOf ('-'));
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Met deze functie wordt een / voor de dir of id geplakt voordat die aan
 * de BASE_URL wordt toegevoegd.
 */
function addSlashIfNeeded (strDirOfID) {

	if (strDirOfID) {
		return ((strDirOfID.charAt (0)) == '/' ? '' : '/') + strDirOfID;
	}

	return strDirOfID;
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Met deze functie wordt een array met elementen toegevoegd aan een array.
 */
function addElementsToArray (arrElements, arrResults) {

	for (const domElement of arrElements) {
		arrResults.push (domElement);
	}
}

/*
 * Met deze functie worden de elementen met een specifieke tagname toegevoegd aan
 * een array met elementen.
 */
function addElementsWithTagToArray (domRoot, strTagName, arrResults) {
	addElementsToArray (domRoot.getElementsByTagName (strTagName), arrResults);
}

function addElementsWithAttributeToArray (domRoot, strAttributeName, arrResults) {
	addElementsToArray (domRoot.querySelectorAll ('[' + strAttributeName + ']'), arrResults);
}

function addElementsWithClassNameToArray (domRoot, strClassName, arrResults) {
	addElementsToArray (domRoot.getElementsByClassName (strClassName), arrResults);
}

function addFAQElementsToArray (domRoot, strType, arrResults) {
	addElementsToArray (domRoot.querySelectorAll ('[werkvorm]'), arrResults);
}

/*
 * Bij Answer-elements gaat het om elementen met de tag pre, waarin de uitwerking
 * van een opdracht getoond moet worden.
 */
function addElementsForAnswerToArray (domRoot, arrResults) {

	var arrAnswerElements = [];

	/*
	 * Een element met de tag 'pre' bevat de uitwerking van een opdracht als 
	 * voor het betreffende element óf geen class is gedefinieerd óf minimaal 
	 * de class 'blended-wrapper' is gedefinieerd.
	 * In dat geval moet het element worden toegevoegd aan de lijst met elementen 
	 * waarin een uitwerking moet worden getoond.
	 */ 
	for (domPre of domRoot.getElementsByTagName ('pre')) {

		if (!domPre.hasAttribute ('class')
		    ||
		    domPre.classList.contains ('blended-wrapper')) {
			arrAnswerElements.push (domPre);
		}
	}

	addElementsToArray (arrAnswerElements, arrResults);
}

/*
 * Voegt een tekst toe aan een komma-gescheiden string.
 */
function voegStringToeAanKommaGescheidenString (strTekst, strNieuweTekst) {

	if (strTekst != '') {
		strTekst += ',';
	}

	return strTekst + strNieuweTekst;
}

/*
 * Replace name 'blended' in strNames by a list of possible blended names like POWERPOINT, MEDIASITE etc..
 */
function voegBlendedNamenToe (strNames) {

	var strToevoeging = '';

	if (strNames.includes ('blended')) {
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, MEDIASITE); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, STREAM); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, YOUTUBE); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, 'pre'); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, WOOCLAP); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, WOOFLASH); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, UITWERKING); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, DOWNLOAD); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, 'werkvorm'); '// Voor FAQ-elementen'
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, POWERPOINT);
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, PDF);
	}

	if ((strNames.slice (-1) != ',') && (strToevoeging != '')) {
		strNames += ',';
	}

	return strNames + strToevoeging;
}

/*
 * Met deze functie wordt een lijst met elementen opgehaald die is gebaseerd
 * op een lijst met tags (een uitbreiding dus op de standaard functie 
 * getElementsByTagName).
 *
 * Op 23 november 2022 gekopieerd en aangepast vanaf https://www.quirksmode.org/dom/getElementsByTagNames.html.
 */
function getElementsByNames (strNames, domRoot = document) {

	if (strNames.includes ('blended')) {
		strNames = voegBlendedNamenToe (strNames);
	}

	var arrNames = strNames.split (',');
	var arrResults = new Array ();

	for (var strName of arrNames) {

		switch (strName.toLowerCase ()) {

			case 'blended':
			case 'h2':
			case 'h3':
			case 'h4':
				addElementsWithTagToArray (domRoot, strName, arrResults);
				break;

			case 'werkvorm':
			case FAQ:
				addFAQElementsToArray (domRoot, FAQ, arrResults);
				break;

			case WOOCLAP:
			case WOOFLASH:
			case DOWNLOAD:
			case MEDIASITE:
			case STREAM:
			case YOUTUBE:
			case POWERPOINT:

				if (strName == WOOCLAP) {
					strName = strName + '-dir';
				}
				else if (strName == DOWNLOAD) {
					strName = strName + '-link';
				}
				else {
					strName = strName + '-id';
				}

				// Geen break, want na de wijziging van de naam hierboven moeten de elementen nog worden toegevoegd.

			case PDF:
				addElementsWithAttributeToArray (domRoot, strName, arrResults);
				break;

			case 'pre':
				addElementsForAnswerToArray (domRoot, arrResults);
				break;

			case 'test-instellingen':
				addElementsWithClassNameToArray (domRoot, strName, arrResults);
				break;
		}
	}

	var domTest = arrResults [0];

	if (!domTest) {
		return [];
	}

	if (domTest.sourceIndex) {

		arrResults.sort (function (a, b) {
			return a.sourceIndex - b.sourceIndex;
		});
	}
	else if (domTest.compareDocumentPosition) {

		arrResults.sort (function (a, b) {
			return 3 - (a.compareDocumentPosition (b) & 6);
		});
	}

	return arrResults;
}

/*
 * Test de function getElementsByNames.
if (Test.blnTestsShouldBeExecuted) {

	for (const domElement of getElementsByNames ('h2,h3,h4,blended')) {
		console.log ('Test getElementsByNames: ' + domElement.tagName + ' - ' + domElement.innerHTML);
	}
}
 */

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Het element wordt (op dezelfde plek in de hiërarchie) vervangen door een wrapper
 * waarna het bestaande element aan de wrapper wordt toegevoegd.
 */
function addWrapperToElement (domElement, strTagForWrapper, blnCopyAttributes = false) {
	var domParent = domElement.parentNode;
	var domWrapper = document.createElement (strTagForWrapper);
	domParent.replaceChild (domWrapper, domElement);
	domWrapper.appendChild (domElement);
}

/*
 * Vervang het element door een vergelijkbaar element met een andere tagname.
 */
function replaceTagName (domElement, strNewTagName) {

	/*
	 * De oude TagName wordt zowel in de start- als in de eindtag (zowel <div> als </div>) vervangen
	 * door de nieuwe TagName.
	 */
	var strOldTagName = domElement.tagName.toLowerCase ();
	var strOuterHTML = domElement.outerHTML;
	strOuterHTML = strOuterHTML.replace ('<' + strOldTagName, '<' + strNewTagName);
	strOuterHTML = strOuterHTML.replace (strOldTagName + '>', strNewTagName + '>');

	/*
	 * De nieuwe node wordt toegevoegd op de plek van de oude node.
	 */ 
	domElement.insertAdjacentHTML ('afterend', strOuterHTML);
	var domNew = domElement.nextSibling;
	domElement.parentElement.removeChild (domElement);

	return domNew;
}

// /////////////////////////////////////////////////////////////////////////// //

function setIDForBlendedElement (strType, domElement, intTeller) {
	var strElementID = strType + '-' + intTeller;
	domElement.setAttribute ('id', strElementID);
	return strElementID;
}

// /////////////////////////////////////////////////////////////////////////// //


// /////////////////////////////////////////////////////////////////////////// //

/*
 * Voeg een element toe na domH, waarin een studietijd wordt vermeld.
 */
function addElementMetStudietijd (domH, strParagraph, strTekst) {
	domTijd = document.createElement ('div');
	domTijd.classList.add ('blended-tijd');
	domTijd.setAttribute ('paragraph', strParagraph);
	domTijd.innerHTML = strTekst;
	domH.parentNode.insertBefore (domTijd, domH.nextSibling);
}

// /////////////////////////////////////////////////////////////////////////// //

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van de content van alle div's met de class 'blended-tijd' wordt deze
 * div gevuld met de juiste tijd (in uren, eventueel hele kwartieren en minuten)
 * en wordt rechts navigatie toegevoegd.
 */
function updateTijd (domH, strParagraph, strTijdAttribuut) {

	var strTag = domH.tagName;
	var strStudietijd = domH.getAttribute ('studietijd');
	var blnIsExtraStof = false;

	switch (strStudietijd) {

		case '':
		case null:
			break;

		case 'som':

			var intSom = 0;
			var intExtraSom = 0;
			var blnOptellingCompleet = false;
			var blnHuidigeElementGevonden = false;

			domH.setAttribute ('paragraph', strParagraph);

			for (const child of getElementsByNames ('h2,h3,h4')) {

				var strParagraafChild = child.getAttribute ('paragraph');

				if (strParagraafChild == strParagraph) {
					blnHuidigeElementGevonden = true;
				}
				else if (blnHuidigeElementGevonden && !blnOptellingCompleet) {

					/* 
					 * De optelling van studietijden stopt niet alleen bij een paragraaf van het zelfde nivau,
					 * maar ook als een nieuw hoofdstuk begint. Bij de optelling van studietijden binnen een h3
					 * moet het zoeken niet alleen stoppen als een volgende h3 wordt gevonden, maar ook als
					 * een h2 wordt gevonden.
					 */
					var intNiveau = parseInt (strTag.charAt (1))
					var intNiveauChild = parseInt (child.tagName.charAt (1));

					if (intNiveauChild <= intNiveau) {
						blnOptellingCompleet = true;
						break;
					}
					else {
						strStudietijd = child.getAttribute ('studietijd');
						blnIsExtraStof = strStudietijd && strStudietijd.includes (EXTRA_STOF);
						intStudietijd = Studietijd.getStudietijd (child);

						blnIsExtraStof && (intStudietijd > 0) ? intExtraSom += intStudietijd : intSom += intStudietijd;
					}
				}
			}

			// toonToetsEnExtraStudietijd (domH, strParagraph, 'som', intSom, intExtraSom);
			break;

		case 'totaal':

			var intSom = 0;
			var intExtraSom = 0;
			var blnIsExtraStof;

			for (const child of getElementsByNames ('h2,h3,h4')) {

				strStudietijd = child.getAttribute ('studietijd');

				if (strStudietijd) {

					blnIsExtraStof = strStudietijd.includes (EXTRA_STOF);
					var intStudietijd; // = getStudietijd (child);

					// if (intStudietijd > 0) {
						blnIsExtraStof ? intExtraSom += intStudietijd : intSom += intStudietijd;
					// }
				}
			}

			// toonToetsEnExtraStudietijd (domH, strParagraph, 'totaal', intSom, intExtraSom);
			break;

		default:

			blnIsExtraStof = strStudietijd.includes (EXTRA_STOF);

			if (blnIsExtraStof) {
				strStudietijd = strStudietijd.slice (EXTRA_STOF.length);
			}

			strSoortStudietijd = (blnIsExtraStof ? 'Studietijd extra stof (facultatief): ' : 'Studietijd toetsstof: ');
			strGeschrevenTijd = Studietijd.getGeschrevenTijd (strStudietijd);

			if (strGeschrevenTijd) {

				var strTekst = strSoortStudietijd + Studietijd.getGeschrevenTijd (strStudietijd);

				if (blnIsExtraStof) {
					strClass='extraMaterial';
				}
				else {
					strClass = 'melding';
				}

				strTekst = '<span class="' + strClass + '">' + strTekst + '</span>'
			
				addElementMetStudietijd (domH, strParagraph, strTekst);
			}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Deze functie bepaalt de index van het huidige element in de lijst met 
 * elementen van het type h2, h3 of h4.
 */
function getIndexVanElementMetParagraafnummer (domMetParagraaf, arrElements) {

	var intIndex = 0;

	for (const domH of arrElements) {

		if (domH == domMetParagraaf) {
			return intIndex;
		}
		else {
			intIndex++;
		}
	}

	return -1;
} 

/*
 * Bepaal de paragraaf waarnaar met de button 'Algemeen - Vorige.png' naar verwezen moet worden.
 */
function getVolgendeOfVorigeParagraaf (strParagraph, strRichting) {

	var arrH = getElementsByNames ('h2,h3,h4');
	var domH = getElementMetParagraafnummer (strParagraph);
	var intIndex = getIndexVanElementMetParagraafnummer (domH, arrH);

	/*
	 * Als de paragraaf voorkomt in de array navigatie, kan - afhankelijk van of op vorige of volgende is 
	 * geklikt - worden gezocht naar de vorige of volgende paragraaf waarvoor 'navigatie="yes"' is ingesteld.
	 */
	if (intIndex > -1) {

		var blnGevonden = false;
		
		intIndex += ((strRichting == "vorige") ? -1 : 1);

		while ((intIndex >= 0) && (intIndex < arrH.length)) {

			var domNabijeH = arrH [intIndex];
			var strWelOfNiet = domNabijeH.getAttribute ('navigatie');

			/*
			 * Test van de paragrafen waarnaar wordt gezocht.
			var strID = domNabijeH.id;
			var strTitel = domNabijeH.innerHTML;
			var strNavigatieParagraph = domNabijeH.getAttribute ('paragraph');
			console.log (intIndex + ': ' + strNavigatieParagraph + ' - ' + strID + ' - ' + strTitel + ' (' + strWelOfNiet + ')');
			 */

			if (strWelOfNiet == "yes") {
				return domNabijeH;
			}

			intIndex += ((strRichting == "vorige") ? -1 : 1);
		}
	}

	return null;
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Bepaal de HTML voor een image (incl href)
 */
function getIcon (strType, strParagraph = '0') {

	var strIcon;
	var strInactief = '';
	var strURL = '';
	var strTitle = '';
	var domInhoudsopgave = document.getElementById ('h2-inhoud');

	/*
	 * Als het type van de button 'inhoudsopgave' is, worden het icoontje en een eventuele
	 * link toegevoegd.
	 */
	if (strType == INHOUDSOPGAVE) {

		if (domInhoudsopgave) {
			strURL = '#h2-inhoud';
			strTitle = INHOUDSOPGAVE;
		}
		else {
			strInactief = ' - Inactief';
		}
	}
	else {

		var domVerwezenH = getVolgendeOfVorigeParagraaf (strParagraph, strType);

		/*
		 * Als een vorige of volgende paragraaf niet bestaat, wordt een grijs icoontje
		 * getoond en wordt geen link toegevoegd.
		 */
		if (domVerwezenH) {
			strURL = '#' + domVerwezenH.id;
			strTitle = domVerwezenH.innerHTML;
		}
		else {
			strInactief = ' - Inactief';
		}
	}

	strIcon = '<img src="' + getImageURL ('Algemeen - ' + strType + strInactief + '.png') + '">'
	
	if (strURL) {
		strIcon = '<a href="' + strURL + '" title="' + strTitle + '" class="navigatie-link">' + strIcon + '</a>';
	}

	// Zo voorkom je dat ook bij het klikken op de padding rechts van het icoontje de link wordt gevolgd.
	strIcon = '<span>' + strIcon + '</span>';

	return strIcon;
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Voor de elementen met tags h2, h3 of h4 wordt gecontroleerd of de navigatie moet
 * worden ingesteld (het attribuut 'navigatie' heeft dan de waarde "yes"). In dat
 * geval wordt navigatie toegevoegd en als het element 'blended-tijd' nog niet
 * bestaat, wordt dit blokje alsnog aangemaakt.
 */
function addNavigatie () {

	/*
	 * Voor alle paragrafen met strTag (h2, h3 of h4) wordt gekeken of er navigatie moet
	 * worden toegevoegd (het attribuut 'navigatie' heeft de waarde "yes").
	 */
	for (const domParagraph of getElementsByNames ('h2,h3,h4')) {

		var strParagraph = domParagraph.getAttribute ('paragraph');

		if (domParagraph.getAttribute ('navigatie') == "yes") {

			domVolgendeElement = domParagraph.nextSibling;

			/*
			 * Als dit element nog niet bestaat, wordt een nieuw element aangemaakt.
			 */
			if (!domVolgendeElement || !domVolgendeElement.classList || !domVolgendeElement.classList.contains ('blended-tijd')) {
				domVolgendeElement = document.createElement ('div');
				domVolgendeElement.classList.add ('blended-navigatie');
				domVolgendeElement.setAttribute ('paragraph', strParagraph);
				domVolgendeElement.innerHTML = '&nbsp;';
				domParagraph.parentNode.insertBefore (domVolgendeElement, domParagraph.nextSibling);
			}

			/*
			 * De navigatie-buttons worden toegevoegd naast de studietijd of in een nieuwe div die
			 * hierboven is aangemaakt.
			 */
			var divNavigatie = document.createElement ('div');
			divNavigatie.classList.add ('navigatie-buttons');

			divNavigatie.innerHTML += getIcon (VORIGE, strParagraph);
			divNavigatie.innerHTML += getIcon (INHOUDSOPGAVE);
			divNavigatie.innerHTML += getIcon (VOLGENDE, strParagraph);

			domVolgendeElement.appendChild (divNavigatie);			
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * h2, h3 en h4 worden nu automatisch van een nummer voorzien:
 *
 * - h2 krijgt als nummer 'Hoofdstuk x'.
 * - h3 krijgt als nummer 'x.y'.
 * - h4 krijgt als nummer 'x.y.z'.
 *
 * Daarna worden het betreffende hoofdstuk of de (sub-)paragraaf aan de inhoudsopgave toegevoegd.
 */
function addCorrectParagraphNumbersToDocument () {

	var intHoofdstuk = 0;
	var intParagraaf = 0;
	var intSubparagraaf = 0;
	var strParagraph;

	/*
	 * De basis van de inhoudsopgave wordt getoond.
	 */
	// toonInhoudsopgave (document.getElementById (INHOUDSOPGAVE));

	/*
	 * Als de titel voor een FAQ later wordt toegevoegd, wordt de paragraaf niet mee genummerd.
	 * Dat gebeurt dus op deze plek.
	 */
	for (var child of getElementsByNames (FAQ)) {
		var strNiveau = child.getAttribute ('header');
		var strTitel = child.getAttribute ('title');
		var domTitel = document.createElement ('h' + (strNiveau || '3'));
		domTitel.innerHTML = strTitel || 'FAQ';
		child.parentNode.insertBefore (domTitel, child);
	}

    /*
     * Voor alle (sub-)elementen in het document wordt gecontroleerd of ze van het type h2, h3 of h4 zijn.
     */
	for (var child of getElementsByNames ('h2,h3,h4,blended')) {

		var strTag = child.tagName.toLowerCase ();
		var strID = child.id;
		var strInhoud = child.getAttribute ('inhoud');
		var strNummering = child.getAttribute ('nummering');
		var strType = child.getAttribute ('type');

		/*
		 * Als voor deze h2, h3 of h4 één van de attributen voor studietijd is ingesteld,
		 * wordt een div toegevoegd, waarin de studietijd wordt getoond.
		 * Zie ook commentaar hieronder bij de 'case 'blended''; het kan zijn dat een 
		 * element wel verwijderd is uit de DOM, maar dat hij nog wel voorkomt in de lijst
		 * die is opgehaald met getElementsByNames hierboven in de for. Dan moet de studie-
		 * tijd natuurlijk niet (dubbel) worden opgehoogd. 
		 */
		if (child.getAttribute ('studietijd') && (child.parentNode != null)) {
			updateTijd (child, strParagraph);
		}

        /*
         * Als een paragraaf genummerd mag worden en/of in de inhoudsopgave moet worden toegevoegd, wordt 
         * een paragraafnummer berekend en wordt dat paragraafnummer als id en/of als het attribuut
         * paragraph toegevoegd.
         */
		if ((strNummering != 'no') || (strInhoud == 'yes')) {

			/*
			 * Alleen als een hoofdstuk of (sub-)paragraaf genummerd moet worden, wordt nu het nummer berekend.
			 */
			if (strNummering != 'no') {

				switch (strTag) {

					case 'h2':
						++intHoofdstuk;
						intParagraaf = 0;
						intSubparagraaf = 0;
						strParagraph = 'Hoofdstuk ' + intHoofdstuk;
						break;

					case 'h3':
						++intParagraaf;
						intSubparagraaf = 0;
						strParagraph = (intHoofdstuk > 0 ? intHoofdstuk + '.' : '') + 
						 			   intParagraaf;
						break;

					case 'h4':
						++intSubparagraaf;
						strParagraph = (intHoofdstuk > 0 ? intHoofdstuk + '.' : '') + 
						               (intParagraaf > 0 ? intParagraaf + '.' : '') + 
						               intSubparagraaf;
						break;

					case 'pre':

						if ((child.className != '')
						    &&
						    !child.classList.contains (BLENDED_WRAPPER)) {
							break;
						}

						if (child.classList.contains (BLENDED_WRAPPER)) {
							child.removeAttribute ('class');
						}

						/*
						 * Om te voorkomen dat er een dubbele wrapper wordt toegevoegd (dat is het geval
						 * als de uitwerking van een opdracht in pre nog is gemarkeerd met de class
						 * 'blended-wrapper', die hierboven is verwijderd), wordt dit niet opnieuw gedaan.
						 */
						if (child.parentNode.classList.contains (BLENDED_WRAPPER)) {
							break;
						}

						addWrapperToElement (child, 'div');
						child = child.parentNode;

						// Het statement break is hier bewust achterwege gelaten, omdat onderstaande
						// code niet alleen voor 'blended' en 'div'-elementen, maar ook voor 
						// de overgebleven 'pre'-elementen van toepassing is.

					case 'blended':
					case 'div':

						/*
						 * Hoewel het element met tag blended in replaceTagName is verwijderd uit de DOM,
						 * komt het element (zonder parent) nog wel voor in de lijst met relevante tags
						 * waarop de for hierboven wordt uitgevoerd.
						 * Als dat het geval is, wordt dit element niet opnieuw bekeken.
						 */
						if (child.parentNode == null) {
							break;
						}

						/*
						 * Als dat nog niet het geval is, wordt de class 'blended-wrapper' voor de opmaak van
						 * het element toegevoegd.
						 *
						 * Als paragraph wordt het nummer van de paragraaf toegevoegd, waarin het 'blended'
						 * element voorkomt. De id wordt daar ook op aangepast.
						 */
						child.classList.add (BLENDED_WRAPPER);
						child.setAttribute ('paragraph', strParagraph);
						child.id = 'blended-' + strParagraph;

						/*
						 * Als dat nog niet is gebeurd, worden de 'blended' en 'uitwerking'-tags vervangen
						 * door 'div'.
						 */
						if (strTag == 'blended') {
							replaceTagName (child, 'div');
						}

						break;
				}
			}

			/*
			 * Alle h2-, h3- en h4-elementen worden nu genummerd met het juiste paragraafnummer en
			 * ze worden toegevoegd aan de inhoudsopgave.
			 */
			if ((strTag == 'h2') || (strTag == 'h3') || (strTag == 'h4')) {

				child.setAttribute ('paragraph', strParagraph);

				if (!strID) {
					strID = strParagraph;
					child.id = strID;
				}

				var trRegel;

				/*
				 * Eventueel wordt het type van een hoofdstuk of (sub-)paragraaf aan de zichtbare titel toegevoegd
				 * en wordt dat type natuurlijk ook aan de titel in de inhoudsopgave toegevoegd.
				 */
				if (strType) {
					strType = strType.charAt (0).toUpperCase () + strType.slice (1)
					child.innerHTML =  strType + ' - ' + child.innerHTML;
					// tdTitle ? tdTitle.innerHTML = strType + ' - ' + tdTitle.innerHTML : tdTitle = null;
				}

				/*
				 * Als er een inhoudsopgave is, wordt het hoofdstuk of de (sub-)paragraaf toegevoegd
				 * aan de inhoudsopgave.
				 */
				objPagina.addParagraaf (child, intHoofdstuk);

				/*
				 * Als de paragraaf genummerd moet worden, wordt het nummer toegevoegd aan de zichtbare titel.
				 */
				if (strNummering != 'no') {
					child.innerHTML = strParagraph + ' - ' + child.innerHTML;
				}
			}
		}
  	}

  	addNavigatie ();
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Gekopieerd en aangepast vanaf https://gomakethings.com/finding-the-next-and-previous-sibling-elements-that-match-a-selector-with-vanilla-js/
 * Geeft de id van de laatste h2, h3 of h4 voor het element.
 */ 
function getHuidigeParagraafID (domHuidige) {

	/*
	 * Als het vorige element van het type h2, h3 of h4 is, geef dan de id terug.
	 * Anders zoek je terug in de lijst totdat je wel een h2, h3 of h4 tegenkomt.
	 */
	while (domHuidige) {

		/*
		 * Neem het element voorafgaand aan het huidige element.
		 */
		var domVorige = domHuidige.previousElementSibling;
		var strTagname;
		var strID;

		if (!domVorige) {
			domVorige = domHuidige.parentElement;
		}

		/*
		 * Als er geen vorig element is gevonden, wordt in de hiërarchie een niveau
		 * hoger gezocht naar het bijbehorende hoofdstuk of de (sub-)paragraaf.
		 */
		if (domVorige) {
			strTagname = domVorige.tagName.toLowerCase ();
		}

		/*
		 * Als het hoofdstuk of de (sub-)paragraaf is gevonden, wordt het id van
		 * het element teruggegeven (zodat de back-knop van de browser teruggaat naar de plek
		 * waar op de link werd geklikt).
		 * Anders wordt verder gezocht.
		 */
		if ((strTagname == 'h2') || (strTagname == 'h3') ||(strTagname == 'h4')) {
			return domVorige.id;
		}
		else {
			return getHuidigeParagraafID (domVorige);
		}
	}

	return 'onbekend';
}

// /////////////////////////////////////////////////////////////////////////// //

// /////////////////////////////////////////////////////////////////////////// //


// /////////////////////////////////////////////////////////////////////////// //

/* 
 * Bepaal welke wrapper een id strElementID heeft en ken dit element de correcte class toe
 * (gebaseerd op het type van de wrapper).
 */
function getElementByIdAndAddClasses (strElementID, strType, strAttribute = 'ID') {

	var domElement;

	switch (strAttribute) {
		default:
			domElement = document.getElementById (strElementID);
	}

	var strClassName = strType + '-wrapper';

	if (domElement.classList) {
		domElement.classList.add (strClassName);
	}
	else {
		domElement.setAttribute ('class', strClassName);
	}

	return domElement;
}

/*
 * Gebaseerd op de naam van het plaatje wordt de volledige directory van het plaatje bepaald.
 */
function getImageURL (strFilename) {
	return strRootDir + '/media/' + strFilename;
}

/*
 * Gebaseerd op het type van de wrapper wordt het juiste icoontje getoond.
 */
function getIconHTML (strType) {

    var strIconName;

	switch (strType) {
		case MEDIASITE: strIconName = 'Play'; break;
		case STREAM: strIconName = 'Play'; break;
		case YOUTUBE: strIconName = 'Play'; break;
		case WOOCLAP: strIconName = 'Proeftoets'; break;
		case UITWERKING: strIconName = 'Uitwerking'; break;
		case DOWNLOAD: strIconName = 'Download'; break;
		case INHOUDSOPGAVE: strIconName = 'Content'; break;
		case VIDEOLIST: strIconName = 'Play'; break;
		case POWERPOINT: strIconName = 'PowerPoint'; break;
		default: strIconName = "Onbekend";
	}

	return '<div class="icon-div">' + 
	       '    <img src="' + getImageURL ('Algemeen - ' + strIconName + '.png') + '" class="icon-img">' +
	       '</div>';
}

/*
 * In de wrapper met strElementID worden de juiste elementen op de juiste plek toegevoegd.
 */
function getToggleWrapper (strElementID, strType, strVisibleContent, strInvisibleContent, blnVisibility = false) {

	var strContentDiv;

	/*
	 * Een download-wrapper is altijd zichtbaar (en kan dus niet onzichtbaar worden gemaakt). De
	 * andere wrappers zijn wel clickable en voor deze wrappers kan de content (on-)zichtbaar
	 * worden gemaakt.
	 */
	if (strType == DOWNLOAD) {
		strContentDiv = '<div>';
	}
	else {
		strContentDiv = '<div onclick="toonInlineContent (\'' + strElementID + '\');" class="toggle-wrapper">';
	}

    /*
     * De zichtbare content wordt naast een icoontje getoond.
     */
	strContentDiv += '   ' + getIconHTML (strType) +
	       			 '   <div class="toggle-div">' +
	       			 '       ' + strVisibleContent +
	       			 '   </div>' + 
	       			 '</div>';

    var strStyle;

	if (blnVisibility) {
        strStyle = '"display: block; padding-bottom: 25px;"';
	}
	else {
		strStyle = '"display: none; padding-bottom: 0px;"';
	}

    /*
     * Als er onzichtbare content is meegegeven, wordt die toegevoegd aan de wrapper.
     */
	if (strInvisibleContent) {
		strContentDiv += '<div id="' + strElementID + '-toggable-content" class="blended-content" style=' + strStyle + '>' +
	           			     strInvisibleContent + 
	       				 '</div>';
	}

	return strContentDiv;
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Als dat element moet worden getoond, wordt het opgemaakt, zodat er video's aan 
 * toegevoegd kunnen worden.
 */

function toonVideoCatalog (domVideo) {

	domVideo.classList.add (BLENDED_WRAPPER);
    domVideo.classList.add (VIDEOLIST + '-wrapper');

	/*
	 * De initiële zichtbaarheid van de inhoudsopgave (toggle is open) wordt
	 * als css-stijl ingesteld op de (on-)zichtbare content.
	 */
	var blnVisibility = ((domVideo.getAttribute ('visible') == 'true') ? true : false);

	var strElementID = domVideo.id;
	var strVisibleContent = 'Klik <em><a class="videoLink">hier</a></em> om de lijst met gebruikte video\'s (on-)zichtbaar te maken.';
	var strInvisibleContent = '<table id="tabel-video" class="videolist"><tr><td></td><td></td></tr></table>';
	domVideo.innerHTML = getToggleWrapper (strElementID, VIDEOLIST, strVisibleContent, strInvisibleContent, blnVisibility);

	var domToelichting = document.createElement ('p');
	domToelichting.innerText = 'Hieronder vind je de lijst met video\'s die op deze pagina verder worden toegelicht. ' +
	                           'In deze lijst zijn ze overzichtelijk op een rij gezet.';
	domVideo.parentNode.insertBefore (domToelichting, domVideo);

	return document.getElementById ('tabel-video');
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Met deze methode wordt een URL toegevoegd, waarmee je een document ook in een
 * nieuw tabblad kunt openen. Deze link kan dan onder de blended wrapper worden 
 * toegevoegd.
 */
function addURLForNewTab (strType, strDocumentName, domElement) {

	var domURL = document.createElement ('p');
	domURL.classList.add ('blended-wrapper-url-naar-nieuw-tabblad');
	domURL.innerHTML = 'Je kunt ' + strType + ' ook in een nieuw tabblad bekijken door op ' +
	                   '<a href="' + strDocumentName + '" target="_blank">deze link</a> ' +
	                   'te klikken.';
	domElement.parentNode.insertBefore (domURL, domElement.nextSibling);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Paragraaf en titel van een mediasite-video worden met de link naar de video toegevoegd
 * aan een lijst met video's die op deze pagina zijn toegevoegd.
 */
function addVideoContentToList (strVideoID, strParagraph, strTitle, strType = MEDIASITE) {

	/*
	 * Als dat element is toegevoegd op de pagina, wordt De lijst met video's in de DIV met id '#video-list' getoond.
	 */
	var domVideo = document.getElementById (VIDEOLIST);

	if (domVideo) {

		/*
		 * Als de tabel voor de lijst met video's nog niet is toegevoegd, gebeurt dat nu.
		 */
		tblVideo = document.getElementById ('tabel-video');

		if (!tblVideo) {
			tblVideo = toonVideoCatalog (domVideo);
		}

		var strBaseURL = "";

		switch (strType) {
			case MEDIASITE: strBaseURL = MEDIASITE_BASE_URL; break;
			case STREAM: strBaseURL = STREAM_BASE_URL; break;
			case YOUTUBE: strBaseURL = YOUTUBE_BASE_URL; break;
		}

		/*
		 * De informatie over een video wordt als laatste regel toegevoegd aan de tabel met video's
		 */
		var trRegel = tblVideo.insertRow (-1);
		trRegel.insertCell (0).innerHTML = '<a class="videoLink" style="border-bottom: none;" href="' + strBaseURL + strVideoID + '"' +
		                                   '   target="_blank">' + 
				                               strParagraph + 
				                           '</a>';
		trRegel.insertCell (1).innerHTML = strTitle;
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Creëer de juiste HTML voor een div die (on-)zichtbaar gemaakt kan worden (de toggle-div).
 */
function getInvisibleContent (strType, strLoading) {

	var strInvisibleContent = '<div class="toggable-content">';

	if (strLoading != '') {
		strInvisibleContent += '    <div class="loading">' + strLoading + '</div>';
	}

	strInvisibleContent += '    <iframe frameborder="0" scrolling="auto" marginheight="0" marginwidth="0"' +
	                       '            allow="fullscreen" data-mce-fragment="1">' + 
    					   '    </iframe>' +
						   '</div>';
	return strInvisibleContent;
}

// /////////////////////////////////////////////////////////////////////////// //

class Blended {

	static get intTeller () {

		if (!this._intTeller) {
			this._intTeller = 0;
		}

		return this._intTeller;
	}

	static set intTeller (intTeller) {
		this._intTeller = intTeller;
	}

	/*
 	 * Alle wrappers krijgen een id die bestaat uit strType gevolgd door '-' en de 
 	 * teller (waarin is bijgehouden in welke volgorde de wrappers op de pagina staan).
 	 * 
	 * strBlendedID kan vervolgens in de aanroepende methode gebruikt worden om
	 * te refereren naar deze wrapper.
	 */
	get strElementID () {

		if (!this._strElementID) {
			this._strElementID = this.strType + '-' + Blended.intTeller++;
		}

		return this._strElementID;
	}

	constructor (domElement, strType, strTypeDocument, strEmbed, strLink, strLoadMelding) {

		if (domElement) {

			this.strType = strType;
			domElement.classList.add (BLENDED_WRAPPER);
			domElement.classList.add (strType + '-wrapper');
			domElement.setAttribute ('paragraph', Paragraaf.strParagraaf);
			domElement.id = this.strElementID;
			this.domBlendedElement = domElement;

			this.strTypeDocument = strTypeDocument || '';
			this.strEmbed = strEmbed || '';
			this.strLink = strLink || '';
			this.strLoadMelding = strLoadMelding || '';
			this.strParagraph = this.domBlendedElement.getAttribute ('paragraph');

			this.strTitle = this.domBlendedElement.getAttribute ('title');
			this.strTitle = Placeholder.replacePlaceholdersInTitle (this.strTitle, this.strType, this.strParagraph);
			domElement.setAttribute ('title', this.strTitle);

			var strVisibility = this.domBlendedElement.getAttribute ('visible');
			this.blnVisibility = (strVisibility == 'true' ? true : false);
			this.createElement ();
		}
	}

	/*
	 * Gebaseerd op het type van de wrapper wordt het juiste icoontje getoond.
	 */
	getIconHTML (strIconName) {
		return '<div class="icon-div">' + 
	           '    <img src="' + getImageURL ('Algemeen - ' + strIconName + '.png') + '" class="icon-img">' +
	           '</div>';
	}

	/*
 	 * Creëer de juiste HTML voor een div, waarin de link komt te staan die de toggle-div
 	 * (on-)zichtbaar kan maken.
	 */
	getVisibleContent () {

		var strVisibleContent = 'Maak ' + this.strTypeDocument + 
		                        ' <em><a class="videoLink">hier</a></em> (on-)zichtbaar';
	
		if (this.strTitle) {
			strVisibleContent += ' - ' + this.strTitle;
		}

		return strVisibleContent;
	}

	/*
	 * Creëer de juiste HTML voor een div die (on-)zichtbaar gemaakt kan worden (de toggle-div).
	 */
	getInvisibleContent () {

		let strTypes = DOWNLOAD + ' ' + FAQ;
		let strInvisibleContent = '';

		if (!strTypes.includes (this.strType)) {

			strInvisibleContent = '<div class="toggable-content">';

			if (this.strLoadMelding) {
				strInvisibleContent += '    <div class="loading">' + this.strLoadMelding + '</div>';
			}

			strInvisibleContent += '    <iframe frameborder="0" scrolling="auto" marginheight="0" marginwidth="0"' +
	       						   '            allow="fullscreen" data-mce-fragment="1">' + 
    		   					   '    </iframe>' +
			   					   '</div>';
		}

		return strInvisibleContent;
	}

	/*
	 * De meeste wrappers (behalve die voor Download) kunnen gedeeltelijk onzichtbaar worden
	 * gemaakt. Voor het gedeelte dat zichtbaar blijft, wordt hier de start-tag voor de div
	 * aangemaakt.
	 */
	getToggleActivator () {
		return '<div class="toggle-wrapper">';

		/*
		return '<div onclick="toonInlineContent (\'' + this.strElementID + '\');" ' + 
			   '     class="toggle-wrapper">';
			   */
	}

	/*
	 * In de wrapper met strElementID worden de juiste elementen op de juiste plek toegevoegd.
	 */
	addToggleWrapper () {

		var strContentDiv = this.getToggleActivator ();

    	/*
     	 * De zichtbare content wordt naast een icoontje getoond.
     	 */
		strContentDiv += '   ' + this.getIconHTML () +
	       			 	 '   <div class="toggle-div">' +
	       			 	 '       ' + this.getVisibleContent () +
	       			 	 '   </div>' + 
	       			 	 '</div>';

    	var strStyle;

		if (this.blnVisibility) {
        	strStyle = '"display: block; padding-bottom: 25px;"';
		}
		else {
			strStyle = '"display: none; padding-bottom: 0px;"';
		}

    	/*
    	 * Als er onzichtbare content is meegegeven, wordt die toegevoegd aan de wrapper.
    	 */
		if (this.getInvisibleContent ()) {
			strContentDiv += '<div id="' + this.strElementID + '-toggable-content" ' + 
			                 '     class="blended-content">' + // style=' + strStyle + '>' +
	           			     '    ' + this.getInvisibleContent () + 
	       				 	 '</div>';
		}

		this.domBlendedElement.innerHTML = strContentDiv;

		var domToggleWrapper = this.domBlendedElement.querySelector ('.toggle-wrapper');

		if (domToggleWrapper) {

			var domBlendedContent = domToggleWrapper.parentNode.querySelector ('.blended-content');

			if (this.blnVisibility) {
				domBlendedContent.classList.add ('active');
			}

			domToggleWrapper.onclick = function () {
				domBlendedContent.classList.toggle ('active');
			}
		}

	}

	/*
	 * Met deze methode wordt een URL toegevoegd, waarmee je een document ook in een
	 * nieuw tabblad kunt openen. Deze link kan dan onder de blended wrapper worden 
	 * toegevoegd.
	 */
	addURLForNewTab () {

		var domURL = document.createElement ('p');
		domURL.classList.add ('blended-wrapper-url-naar-nieuw-tabblad');
		domURL.innerHTML = 'Je kunt ' + this.strType + ' ook in een nieuw tabblad bekijken door op ' +
		                   '<a href="' + this.strLink + '" target="_blank">deze link</a> ' +
		                   'te klikken.';
		this.domBlendedElement.parentNode.insertBefore (domURL, this.domBlendedElement.nextSibling);
	}

	/*
	 * Met deze method wordt een element aangemaakt en eronder wordt een link naar een 
	 * nieuw tabblad aangemaakt.
	 */
	createElement () {
		this.addToggleWrapper ();
		this.addURLForNewTab ();
	}

	/*
	 * Met deze functie wordt de src van het iframe in domBlended geactiveerd, zodat
	 * de content van de toggable div wordt geladen.
	 */
	embedContent () {

		var arrIFrameElements = this.domBlendedElement.getElementsByTagName ('iframe');

		if (arrIFrameElements.length > 0) {

			var domIFrame = arrIFrameElements [0];
			domIFrame.setAttribute ('src', this.strEmbed);

			// Test van deze functionaliteit
			// if (Test.blnTestsShouldBeExecuted) {
			//     console.log ('Test van Blended.embedContent: Source van ' + this.domBlendedElement.id + ' is ' + domIFrame.getAttribute ('src'));
			// }
		}
	}
}

class BlendedElements {

	constructor () {
		this.arrBlendedElements = [];
	}

	add (objBlended) {
		this.arrBlendedElements.push (objBlended);
	}

	embedContent () {

		this.arrBlendedElements.forEach (objBlendedElement => {
			objBlendedElement.embedContent ();
		});
	}

	addElement (domBlended) {

		const strTag = domBlended.tagName.toLowerCase ();
		const arrNamen = domBlended.getAttributeNames ();

		arrNamen.forEach (strNaam => {

			var objBlended = null;

			switch (strNaam.toLowerCase ()) {

				case PDF: objBlended = new PDFDocument (domBlended); break;
    			case 'werkvorm': new FAQLijst (domBlended); break;
    			case MEDIASITE + '-id': objBlended = new MediaSite (domBlended); break;
        		case STREAM + '-id': objBlended = new MSStream (domBlended); break;
       			case YOUTUBE + '-id': objBlended = new YouTube (domBlended); break;
    			case DOWNLOAD + '-link': new DownloadLink (domBlended); break;

				case POWERPOINT + '-id': 

					if (domBlended.getAttribute ('account')) {
						objBlended = new OnedrivePowerPoint (domBlended);
					}
					else {
						objBlended = new TeamsOfSPPowerPoint (domBlended);
					}

					break;

    			case WOOCLAP + '-dir':
    			case WOOFLASH + '-id':

    				if (!domBlended.classList.contains ('quiz-wrapper')) {

    					switch (domBlended.getAttribute ('type')) {
    						case QUIZVRAAG: objBlended = new Quizvraag (domBlended); break;
    						default: objBlended = new Proeftoets (domBlended); break;
    					}
    				}

    				break;

    			case UITWERKING:
    				new Uitwerking (domBlended);
    				break;
    		}

    		if (objBlended) {
    			this.add (objBlended);
    		}
    	});
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Inhoudsopgave extends Blended {

	get intNiveau () {

		if (!this._intNiveau) {
			this._intNiveau = 3;
		}

		return this._intNiveau;
	}

	set intNiveau (intNiveau) {

		if (this.domBlendedElement) {
			this._intNiveau = this.domBlendedElement.getAttribute ('niveau');
		}

		if (!this._intNiveau || isNaN (this._intNiveau) || (this._intNiveau > 4) || (this._intNiveau < 0)) {
			this._intNiveau = intNiveau;
		}
	}

	constructor () {

		var domInhoudsopgave = document.getElementById (INHOUDSOPGAVE);
		super (domInhoudsopgave, INHOUDSOPGAVE, 'de inhoudsopgave');

		if (domInhoudsopgave) {
			this.tblInhoud = this.domBlendedElement.getElementsByClassName ('tabel-inhoud') [0];
			this.intNiveau = 3 // default level;
			this.domBlendedElement.querySelector ('table').classList.add ('niveau' + this.intNiveau);
		}
	}

	getInvisibleContent () {
		return '<table class="tabel-inhoud">' +
			   '    <tr><td></td><td></td></tr>' +
			   '</table>';
	}

	createElement () {

		if (this.domBlendedElement) {

			super.createElement ();

			var domTitle = document.createElement ('h2');
			domTitle.innerText = INHOUDSOPGAVE.charAt (0).toUpperCase () + INHOUDSOPGAVE.slice (1);
			domTitle.id = 'h2-inhoud';
			domTitle.setAttribute ('nummering', 'no');
			domTitle.setAttribute ('studietijd', 'totaal');
			this.domBlendedElement.parentNode.insertBefore (domTitle, this.domBlendedElement);
		}
	}

	addURLForNewTab () {}

	addParagraaf (domParagraaf, domSectie, intHoofdstuk) {

		if (this.domBlendedElement) {

			var strTag = domParagraaf.tagName.toLowerCase ();
			var strInhoud = domParagraaf.getAttribute ('inhoud');
			var strID = domParagraaf.id;
			var strParagraaf = domParagraaf.getAttribute ('paragraph');
			var strTitle = domParagraaf.innerHTML;

			/*
			 * In de inhoudsopgave wordt boven elk hoofdstuk een lege regel getoond.
			 */
			if ((strTag == 'h2') && (intHoofdstuk > 1) && (strInhoud != 'no')) {
				trRegel = this.tblInhoud.insertRow (-1);
				trRegel.insertCell (0).innerHTML = '&nbsp;';
				trRegel.insertCell (1);
			}

			/*
			 * Het hoofdstuk of de (sub-)paragraaf wordt als laatste regel in de inhoudsopgave toegevoegd.
			 * Dat gebeurt natuurlijk alleen als voor een paragraaf niet is ingesteld dat 'inhoud' "no" is.
			 */
			var tdTitle;

			if (strInhoud != "no") {
				var domA = document.createElement ('a');
				domA.classList.add ('videoLink');
				domA.style.cssText = 'border-bottom: none;';
				domA.href = '#' + strID;
				domA.innerHTML = (strParagraaf == 'no' ? "klik" : strParagraaf)
				var trRegel = this.tblInhoud.insertRow (-1);
				trRegel.classList.add ('niveau' + strTag.charAt (1));
				new Link (domA, domSectie);
				trRegel.insertCell (0).append (domA);
				tdTitle = trRegel.insertCell (1);
				tdTitle.innerHTML = strTitle;
			}
		}
	}

	embedContent () {}

	getIconHTML () {
		return super.getIconHTML ('Content');
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class PowerPoint extends Blended {

	static getURL (domPowerPoint, strURL, strPlaceholder) {
		strURL = Placeholder.replacePlaceholderInTekst (strURL, '%' + strPlaceholder, domPowerPoint.getAttribute (strPlaceholder));
		return Placeholder.replacePlaceholderInTekst (strURL, '%id', domPowerPoint.getAttribute (POWERPOINT + '-id'));
	}

	constructor (domPowerPoint, strEmbed, strLink, strPlaceholder) {
		strEmbed = PowerPoint.getURL (domPowerPoint, strEmbed, strPlaceholder);
		strLink = PowerPoint.getURL (domPowerPoint, strLink, strPlaceholder);
		super (domPowerPoint, POWERPOINT, 'de presentatie', strEmbed, strLink, 'Presentatie wordt geladen...');
	}

	embedContent () {

		var arrToggableElements = this.domBlendedElement.getElementsByClassName ('toggable-content');

		if (arrToggableElements.length > 0) {

			var domToggableElement = arrToggableElements [0];
			var strIFrame = '<iframe src="' + this.strEmbed + '" frameborder="0"></iframe>'
			domToggableElement.innerHTML = strIFrame;

			// Test van deze functionaliteit
			// if (Test.blnTestsShouldBeExecuted) {
			// 	   console.log ('Test van PowerPoint.embedContent: Source van ' + this.domBlendedElement.id + ' is ' + domToggableElement.innerHTML);
			// }
		}
	}

	getIconHTML () {
		return super.getIconHTML ('Powerpoint');
	}
}

class OnedrivePowerPoint extends PowerPoint {

	constructor (domPowerPoint) {
		super (domPowerPoint, ONEDRIVE_BASE_EMBED, ONEDRIVE_BASE_URL, 'account');
	}

}

class TeamsOfSPPowerPoint extends PowerPoint {

	constructor (domPowerPoint) {
		super (domPowerPoint, TEAMS_OF_SP_BASE_EMBED, TEAMS_OF_SP_BASE_URL, 'site');
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class PDFDocument extends Blended {

	/*
	 * Met deze functie worden cheat-sheets voor code smells omgevormd tot PDF-viewers.
	 */
	updatePDFAsCodeSmellsCheatSheet () {

		var domTitel = document.createElement ('h3');
		domTitel.setAttribute ('nummering', 'no');
		domTitel.innerHTML = 'De Code Smell Cheat Sheet';
		this.domBlendedElement.parentNode.insertBefore (domTitel, this.domBlendedElement);

		var domToelichting = document.createElement ('p');
		domToelichting.innerHTML = 'Alle Code Smells (met bijbehorende strategieën) zijn overzichtelijk in een Cheat Sheet bij elkaar gebracht. ' +
		    	                   'Hierin staat alle bekende informatie over Code Smells overzichtelijk op een rij. Deze Cheat Sheet wordt elke ' +
		              			   'keer bijgewerkt met de informatie die jullie op dat moment leren. Je vindt hier dus een levend document dat ' +
		                     	   'groeit en uiteindelijk alle informatie bevat over de Code Smells die je moet kennen.';
		this.domBlendedElement.parentNode.insertBefore (domToelichting, domTitel.nextSibling);
	}

	/*
	 * Deze code heb ik op 30 november 2022 overgenomen van https://codepen.io/mrapol/pen/ObbOdQ
	 * en daarna aangepast.
	 */
	constructor (domPDFDocument) {

		var strLink = domPDFDocument.getAttribute (PDF);
		var strDocument = 'documenten/OPT3 - Code Smell Cheat Sheet.pdf';

		/*
		 * Als de cheat sheet voor code-smells als documentnaam is opgegeven,
		 * wordt de link aangepast en wijst die naar het goede document.
		 */
		if (strLink == 'code-smell-cheat-sheet') {
			strLink = strDocument;
			domPDFDocument.setAttribute ('pdf-root', 'relative');
			domPDFDocument.setAttribute ('pdf', strLink);
		}

		var strRoot = domPDFDocument.getAttribute ('pdf-root');

		if (strRoot == 'relative') {
			strLink = strRootDir + addSlashIfNeeded (strLink);
		}

		var strEmbed = strLink;
		super (domPDFDocument, PDF, 'het PDF-document', strEmbed, strLink, 'PDF-document wordt geladen...');

		if (strLink.includes (strDocument)) {
			this.updatePDFAsCodeSmellsCheatSheet ();
		}
	}

	createElement () {

		super.createElement ();

		var domPDF = this.domBlendedElement.getElementsByClassName ('toggable-content') [0];

		var domWrapper = domPDF.parentNode;
		domWrapper.classList.add ('pdf-viewer');
		domWrapper.classList.add ('set-pdf-viewer-margin');
		domWrapper.classList.add ('set-pdf-viewer-center-block-horiz');

		domPDF.classList.add ('responsive-pdf-wrapper');
		domPDF.classList.add ('responsive-pdf-wrapper-wxh-572x612');
		domPDF.style.cssText = '-webkit-overflow-scrolling: touch; overflow: auto;';
	}

	getIconHTML () {
		return super.getIconHTML (PDF);
	}

}

// /////////////////////////////////////////////////////////////////////////// //

class FAQVraag extends Observable {

	get blnIsActive () {
		return this.domVraag.classList.contains ('faq-active');
	}

	toggleActiviteit (domElement) {
		domElement.classList.toggle ('faq-active');
	}

	set blnIsActive (blnActive) {

		if (blnActive != this.blnIsActive) {
			this.setChanged ();
			this.toggleActiviteit (this.domVraag);
			this.toggleActiviteit (this.domHR);
			this.toggleActiviteit (this.domAntwoord);
		}
	}

	toggleVraag () {
		this.blnIsActive = !this.blnIsActive;
	}

	/*
	 * Met deze functie wordt het selecteren van een vraag verwerkt.
	 */
	handleSelectieVanVraag (strActie = FAQActions.select) {
		this.toggleVraag ();
		this.notifyObservers (this);
	}

	constructor (domVraagEnAntwoord, objFAQLijst) {
		super ();
		var objVraag = this;
		this.addObserver (objFAQLijst);

		this.domVraagEnAntwoord = domVraagEnAntwoord;
		this.domVraagEnAntwoord.classList.add ('faq-element');

		var arrVraagEnAntwoord = this.domVraagEnAntwoord.children;

		this.domVraag = arrVraagEnAntwoord [0];
		this.domVraag.classList.add ('faq-vraag');

	    this.domVraag.addEventListener ('click', function ()  {
	    	objVraag.handleSelectieVanVraag ();
	    });

		this.domHR = document.createElement ('hr');
		this.domVraag.parentNode.insertBefore (this.domHR, this.domVraag.nextSibling);

		this.domAntwoord = arrVraagEnAntwoord [2];
		this.domAntwoord.classList.add ('faq-antwoord');
	}
}

class FAQLijst extends Blended {

	/*
	 * De teksten die in de FAQ-Setup naast de checkbox komen te staan, staan in de static
	 * variabele objTeksten.
	 */
	static get objTeksten () {
		return  {'checked': 'Eén vraag tegelijk open', 'unchecked': 'Meer vragen tegelijk open'};
	}

	static get objStatus () {

		/*
		 * Als nog geen Status-object is aangemaakt, dan gebeurt dat alsnog. Om dat goed te kunnen
		 * doen, worden ook de Schuifjes toegevoegd aan de DOM-sections met de class 'test-instellingen'.
		 */
		if (!this._objStatus) {
			var blnDefault = true;
			var strKey = 'faq-een-tegelijk';
			this._objStatus = new Status (blnDefault, strKey);
			this._objStatus.notifyObservers ();
		}

		return this._objStatus;
	}

	/*
	 * Om TestFAQSetup goed uit te kunnen voeren, moet tijdelijk een schuifje aan objStatus
	 * worden toegevoegd.
	 */
	static addObserver (objObserver) {
		this.objStatus.addObserver (objObserver);
	}

	static deleteObserver (objObserver) {
		this.objStatus.deleteObserver (objObserver);
	}

	/*
	 * De Setup voor de FAQ toggle-t tussen 'één tegelijk' en 'meer tegelijk'.
	 */
	static get blnEenTegelijk () {
		return this.objStatus.getStatus ();
	}

	static set blnEenTegelijk (blnTegelijk) {
		this.objStatus.setStatus (blnTegelijk);
	}

	get arrVragen () {

		if (!this._arrVragen) {
			this._arrVragen = [];
		}

		return this._arrVragen;
	}

	/*
	 * Als er maar één vraag tegelijkertijd open mag staan, dan wordt de lijst
	 * met vragen aangemaakt met alleen de vraag als element.
	 * 
	 * Als de vraag nog niet voorkomt in de lijst met geselecteerde vragen, dan 
	 * wordt de vraag toegevoegd aan het einde van die lijst.
	 * 
	 * Als de vraag wel voorkomt, wordt de vraag naar het einde van de lijst verplaatst.
	 */
	get objLaatstGeselecteerdeVraag () {

		var objGeselecteerdeVraag = null;

		this.arrVragen.forEach (objVraag => {

			if (objVraag.blnIsActive) {
				objGeselecteerdeVraag = objVraag;
			}
		});

		return objGeselecteerdeVraag;
	}

	getActions (arrActions) {

		var strActions = '';

		arrActions.forEach (strAction => {

			if (strActions) {
				strActions += ',';
			}

			strActions += strAction;
		});

		return strActions;
	}

	updateGeselecteerdeVragen (strFAQAction, objVraag) {

		var strActions = this.getActions ([FAQActions.select, FAQActions.expand]);
		var intIndex = this.arrVragen.indexOf (objVraag);

		if (strActions.includes (strFAQAction) && (intIndex != -1)) {
			this.arrVragen.push (this.arrVragen.splice (intIndex, 1) [0]);
		}
	}

	expandOrMinify (strFAQAction, objVeranderdeVraag) {

		var identity = (x) => x;
		var arrKopieVanVragen = this.arrVragen.map (identity);

		arrKopieVanVragen.forEach (objVraag => {

			if (objVraag !== objVeranderdeVraag) {
				objVraag.blnIsActive = (strFAQAction === FAQActions.expand);
				this.updateGeselecteerdeVragen (strFAQAction, objVraag);
			}
		});

		if (objVeranderdeVraag) {
			this.updateGeselecteerdeVragen (strFAQAction, objVeranderdeVraag);
		}
	}

	expand (objVraag) {
		FAQLijst.blnEenTegelijk = false;
		this.expandOrMinify (FAQActions.expand, objVraag);
	}

	minify (objVraag) {
		this.expandOrMinify (FAQActions.minify, objVraag);
	}

	/*
	 * FAQLijst luistert als Observer mee aan twee kanten:
	 *
	 * - Als een vraag is geselecteerd, moet - afhankelijk van de status van EénTegelijk - de andere vragen
	 *   worden ge(de-)selecteerd.
	 * - Als ergens op de pagina de checkbox voor EénTegelijk is veranderd, moet de checkbox voor EénTegelijk
	 *   voor deze FAQLijst ook mee.
	 */
	update (objObservable, varData) {

		if (typeof varData === 'boolean') {
			varData = this.objLaatstGeselecteerdeVraag;
		}

		/*
		 * Als er maar één vraag tegelijk geselecteerd mag zijn, worden de andere vragen gedeselecteerd.
		 */
		if (FAQLijst.blnEenTegelijk) {
			this.minify (varData);
		}
		else {
			this.updateGeselecteerdeVragen (FAQActions.select, varData)
		}
	}

	get strWerkvorm () {

		if (!this._strWerkvorm) {
			this._strWerkvorm = this.domBlendedElement.getAttribute ('werkvorm');
		}

		return this._strWerkvorm;
	}

	get strHeader () {

		if (!this._strHeader) {
			this._strHeader = 'h' + this.domBlendedElement.getAttribute ('header');
		}

		return this._strHeader;
	}

	constructor (domFAQLijst) {
		super (domFAQLijst, FAQ);
		FAQLijst.objStatus.addObserver (this);
	}

	/*
	 * Creatief gekopieerd vanaf https://sweetcode.io/how-to-build-an-faq-page-with-html-and-javascript/.
	 */
	createElement () {

		var objFAQLijst = this;

		var strNiveau = this.domBlendedElement.getAttribute ('header');
		var strTitel = this.domBlendedElement.getAttribute ('title');
		var domHeader = document.createElement ('h' + (strNiveau || '3'))
		domHeader.innerHTML = strTitel || 'FAQ';
		this.domBlendedElement.parentNode.insertBefore (domHeader, this.domBlendedElement);

		var domToelichting = document.createElement ('p');
		domToelichting.innerHTML = 'Tijdens ' + this.strWerkvorm + ' kwamen een aantal veel voorkomende vragen aan de orde. ' + 
		                           'Die worden hieronder beantwoord.';
		domToelichting.style.cssText += "margin-bottom: 0px;";
		this.domBlendedElement.parentNode.insertBefore (domToelichting, this.domBlendedElement);

		var domSetup = document.createElement ('div');
		domSetup.id = this.strElementID + '-faq-setup';
		domSetup.className = 'faq-setup';
		this.domBlendedElement.insertBefore (domSetup, this.domBlendedElement.firstChild);

		var domExpand = document.createElement ('div');
		domExpand.classList.add ('faq-setup-expand');
		domExpand.onclick = function () {
			objFAQLijst.expand ();
		};
		domSetup.appendChild (domExpand);

		var domMinify = document.createElement ('div');
		domMinify.classList.add ('faq-setup-minify');
		domMinify.onclick = function () {
			objFAQLijst.minify ();
		};
		domSetup.appendChild (domMinify);

		FAQLijst.addObserver (new Schuifje (this.domBlendedElement, FAQLijst.objTeksten, FAQ));

		for (var domVraagEnAntwoord of this.domBlendedElement.children) {

			if (!domVraagEnAntwoord.getAttribute ('class')) {
				this.arrVragen.push (new FAQVraag (domVraagEnAntwoord, this));
			}
		}	

		// Zorg dat een lege lijst met geselecteerde vragen wordt toegevoegd voor element met strElementID.
		FAQLijst.objStatus.notifyObservers (FAQLijst.blnEenTegelijk);
	}

	/*
	 * Content is already loaded during creation of this element.
	 */
	embedContent () {}
}

class TestFAQSetup {

	static clickEenTegelijk () {
		this.domFAQ.querySelector ('.faq-setup-checkbox img').click ();
	}

	static clickExpand () {
		this.domFAQ.querySelector ('.faq-setup-expand').click ();
	}

	static clickMinify () {
		this.domFAQ.querySelector ('.faq-setup-minify').click ();
	}

	static clickFAQ (intElementIndex) {
		this.domFAQ.querySelectorAll ('.faq-element') [intElementIndex].getElementsByTagName ('div') [0].click ();
	}

	static getEenTegelijk (blnTegelijk) {
		return blnTegelijk ? FAQLijst.objTeksten.checked : FAQLijst.objTeksten.unchecked;
	}

	static getArray (arrArray) {

		if (arrArray.length == 0) {
			strArray = 'lege array';
		}
		else if (arrArray.length == 1) {
			strArray = '' + arrArray [0];
		}
		else {

			var strArray = 'Vragen ';

			for (var i = 0; i < arrArray.length; i++) {
				
				if (i > 0) {
					strArray += ", ";
				}
				else if (i == arrArray.length - 1) {
					strArray += ' en ';
				}

				strArray += arrArray [i];
			}
		}

		return strArray;
	}

	static getIndex (domVraag) {
		var domVraagEnAntwoord = domVraag.parentNode;
		var arrVragen = domVraagEnAntwoord.parentNode.querySelectorAll ('.faq-element');
		var intIndex = Array.from (arrVragen).indexOf (domVraagEnAntwoord);
		return intIndex + 1;
	}

	static getActualVolgorde () {

		var arrActual = [];

		this.objFAQLijst.arrVragen.forEach (objFAQVraag => {

			if (objFAQVraag.blnIsActive) {
				arrActual.push (this.getIndex (objFAQVraag.domVraag));
			}
		});

		return TestFAQSetup.getArray (arrActual);	
	}

	static getActualZichtbaar () {

		var arrActual = [];

		for (const domVraag of this.domFAQ.querySelectorAll ('.faq-vraag')) {

			if (domVraag.classList.contains ('faq-active')) {
				arrActual.push (this.getIndex (domVraag))
			}
		}

		return TestFAQSetup.getArray (arrActual);
	}

	static toonResultaat (objTest, intTestnummer, strActie, bln_expFAQEenTegelijk, arr_expGeselecteerdeVragenInVolgorde, arr_expZichtbaarGeselecteerdeVragen) {

		var arrTestdata = [
				{ 
					'melding': 'Instelling één tegelijk', 
				  	'expected': TestFAQSetup.getEenTegelijk (bln_expFAQEenTegelijk), 
				  	'actual': TestFAQSetup.getEenTegelijk (FAQLijst.blnEenTegelijk) 
				},
				{ 
					'melding': 'Laatst geselecteerde vragen', 
					'expected': TestFAQSetup.getArray (arr_expGeselecteerdeVragenInVolgorde), 
					'actual': TestFAQSetup.getActualVolgorde () 
				},
				{ 
					'melding': 'Geselecteerde vragen', 
					'expected': TestFAQSetup.getArray (arr_expZichtbaarGeselecteerdeVragen), 
					'actual': TestFAQSetup.getActualZichtbaar () 
				}
			];

		objTest.execute (intTestnummer, strActie, arrTestdata);
	}

	static test () {

		var strElementID = 'test-faq-setup';
		var domFAQ = document.createElement ('div');
		domFAQ.id = strElementID;
		domFAQ.setAttribute ('header', '2');
		domFAQ.setAttribute ('werkvorm', 'test van de FAQ');
		domFAQ.title = 'Test van de FAQ Setup';
		this.domFAQ = domFAQ;

		/*
		 * Voeg een testbare FAQ toe aan de pagina die aan het einde van de test wordt verwijderd.
		 */
		for (var i = 0; i < 3; i++) {

			var domFAQElement = document.createElement ('div');

			var domVraag = document.createElement ('div');
			domVraag.innerText = 'Vraag ' + (i + 1);
			domFAQElement.appendChild (domVraag);

			var domAntwoord = document.createElement ('div');
			domAntwoord.innerHTML = 'Antwoord ' + (i + 1);
			domFAQElement.appendChild (domAntwoord);

			domFAQ.appendChild (domFAQElement);
		}

		var objTest = new Test ('FAQ-bewerkingen');
		objTest.toonHeader ();

		document.getElementsByTagName ('body') [0].appendChild (domFAQ);
		this.objFAQLijst = new FAQLijst (domFAQ, 999);

		/*
		 * blnEenTegelijk wordt bewaard zodat de waarde straks weer op de waarde in document.cookies
		 * teruggezet kan worden. Daarna wordt de waade voor de test geïnitialiseerd op true.
		 */
		var objSchuifje = new Schuifje (domFAQ, FAQLijst.objTeksten, FAQ);
		FAQLijst.addObserver (objSchuifje);
		var blnEenTegelijk = FAQLijst.blnEenTegelijk;

		FAQLijst.blnEenTegelijk = true;

		TestFAQSetup.toonResultaat (objTest, 1, 'Element geïnitialiseerd', true, [], []);
		TestFAQSetup.clickFAQ (0);
		TestFAQSetup.toonResultaat (objTest, 2, 'Eerste element geselecteerd', true, [1], [1]);
		TestFAQSetup.clickFAQ (2);
		TestFAQSetup.toonResultaat (objTest, 3, 'Derde element geselecteerd', true, [3], [3]);
		TestFAQSetup.clickEenTegelijk ();
		TestFAQSetup.toonResultaat (objTest, 4, 'Checkbox naar "meer tegelijk"', false, [3], [3]);
		TestFAQSetup.clickFAQ (0);
		TestFAQSetup.toonResultaat (objTest, 5, 'Eerste element geselecteerd', false, [3, 1], [1, 3]);
		TestFAQSetup.clickEenTegelijk ();
		TestFAQSetup.toonResultaat (objTest, 6, 'Checkbox naar "één tegelijk"', true, [1], [1]);
		TestFAQSetup.clickExpand ();
		TestFAQSetup.toonResultaat (objTest, 7, 'Expand-all geselecteerd', false, [2, 3, 1], [1, 2, 3]);
		TestFAQSetup.clickEenTegelijk ();
		TestFAQSetup.toonResultaat (objTest, 8, 'Check naar "één tegelijk"', true, [1], [1]);
		TestFAQSetup.clickFAQ (0);
		TestFAQSetup.toonResultaat (objTest, 9, 'Eerste element gedeactiveerd', true, [], []);
		TestFAQSetup.clickFAQ (0);
		TestFAQSetup.toonResultaat (objTest, 10, 'Eerste element geselecteerd', true, [1], [1]);
		TestFAQSetup.clickFAQ (1);
		TestFAQSetup.toonResultaat (objTest, 11, 'Tweede element geselecteerd', true, [2], [2]);
		TestFAQSetup.clickExpand ();
		TestFAQSetup.toonResultaat (objTest, 12, 'Expand-all geselecteerd', false, [3, 1, 2], [1, 2, 3]);
		TestFAQSetup.clickFAQ (1);
		TestFAQSetup.toonResultaat (objTest, 13, 'Tweede element gedeactiveerd', false, [3, 1], [1, 3]);
		TestFAQSetup.clickFAQ (1);
		TestFAQSetup.toonResultaat (objTest, 14, 'Tweede element geselecteerd', false, [3, 1, 2], [1, 2, 3]);
		TestFAQSetup.clickMinify ();
		TestFAQSetup.toonResultaat (objTest, 15, 'Minify-all geselecteerd', false, [], []);
		TestFAQSetup.clickEenTegelijk ();
		TestFAQSetup.toonResultaat (objTest, 16, 'Checkbox naar "één tegelijk"', true, [], []);
		TestFAQSetup.clickFAQ (0);
		TestFAQSetup.toonResultaat (objTest, 17, 'Eerste element geselecteerd', true, [1], [1]);
		TestFAQSetup.clickFAQ (2);
		TestFAQSetup.toonResultaat (objTest, 18, 'Derde element geselecteerd', true, [3], [3]);
		TestFAQSetup.clickMinify ();
		TestFAQSetup.toonResultaat (objTest, 19, 'Minify-all geselecteerd', true, [], []);
		TestFAQSetup.clickFAQ (2);
		TestFAQSetup.toonResultaat (objTest, 20, 'Tweede element geselecteerd', true, [3], [3]);
		TestFAQSetup.clickExpand ();
		TestFAQSetup.toonResultaat (objTest, 21, 'Expand-all geselecteerd', false, [1, 2, 3], [1, 2, 3]);
		TestFAQSetup.clickMinify ();
		TestFAQSetup.toonResultaat (objTest, 22, 'Minify-all geselecteerd', false, [], []);
		TestFAQSetup.clickExpand ();
		TestFAQSetup.toonResultaat (objTest, 23, 'Expand-all geselecteerd', false, [1, 2, 3], [1, 2, 3]);

		objTest.toonFooter ();

		/*
		 * Het element is alleen toegevoegd voor testdoeleinden en kan nu worden verwijderd (inclusief
		 * de toelichting en de header die zijn toegevoegd.
		 */
		domFAQ.previousElementSibling.remove ();
		domFAQ.previousElementSibling.remove ();
		domFAQ.remove ();

		/*
		 * De waarde van blnEenTegelijk wordt weer teruggezet op de waarde zoals die origineel 
		 * (voor bovenstaande test) in document.cookies stond opgeslagen.
		 */
		FAQLijst.deleteObserver (objSchuifje);
		FAQLijst.deleteObserver (this.objFAQLijst);
		FAQLijst.blnEenTegelijk = blnEenTegelijk;
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class VideoList extends Blended {

	constructor (domVideoList) {
		super (domVideoList, VIDEOLIST, 'de lijst met gebruikte video\'s');
	}

	getInvisibleContent () {
		return '<table class="tabel-video" class="videolist"><tr><td></td><td></td></tr></table>'
	}

	/*
	 * Onder dit element wordt geen link getoond die in een nieuwe tabblad kan worden geopend.
	 */
	addURLForNewTab () {}

	createElement () {

		super.createElement ();

		var domToelichting = document.createElement ('p');
		domToelichting.innerText = 'Hieronder vind je de lijst met video\'s die op deze pagina verder worden toegelicht. ' +
   			                       'In deze lijst zijn ze overzichtelijk op een rij gezet.';
		this.domBlendedElement.parentNode.insertBefore (domToelichting, this.domBlendedElement);

		this.tblVideo = this.domBlendedElement.getElementsByClassName ('tabel-video') [0];
	}

	/*
	 * De informatie over een video wordt als laatste regel toegevoegd aan de tabel met video's
	 */
	addVideoToList (strParagraph, strTitle, strLink) {

		var trRegel = this.tblVideo.insertRow (-1);
		trRegel.insertCell (0).innerHTML = '<a class="videoLink" style="border-bottom: none;"' + 
		                                   '   href="' + strLink + '" target="_blank">' + 
				                               strParagraph + 
				                           '</a>';
		trRegel.insertCell (1).innerHTML = strTitle;
	}

	getIconHTML () {
		return super.getIconHTML ('Play');
	}
}

class VideoLists {

	get arrVideoLists () {

		if (!this._arrVideoLists) {
			this._arrVideoLists = [];
		}

		return this._arrVideoLists;
	}

	constructor () {

		for (const domVideoList of document.getElementsByClassName (VIDEOLIST + '-wrapper')) {
			this.arrVideoLists.push (new VideoList (domVideoList));
		}
	}

	addVideoToList (strParagraph, strTitle, strLink) {

		this.arrVideoLists.forEach (objVideoList => {
			objVideoList.addVideoToList (strParagraph, strTitle, strLink);
		});
	}
}

class Video extends Blended {

	static replaceIDInURL (strURL, strID) {
		return strURL.replace ('%id', strID);
	}

	constructor (strType, strEmbed, strLink, domVideo) {
		var strID = domVideo.getAttribute (strType + '-id');
		strLink = Video.replaceIDInURL (strLink, strID);
		strEmbed = Video.replaceIDInURL (strEmbed, strID);
		super (domVideo, strType, 'de video', strEmbed, strLink, 'Video wordt geladen...');
	}

	/*
	 * Alle Mediasite-, MS Stream- en YouTube-video's worden in een lijst (bijv. bovenaan de pagina) verzameld en getoond.
	 */
	createElement () {
		super.createElement ();
		objPagina.addVideoToList (this.strParagraph, this.strTitle, this.strLink);
	}

	getIconHTML () {
		return super.getIconHTML ('Play');
	}
}

class MediaSite extends Video {

	constructor (domMediaSite, intTeller) {
		super (MEDIASITE, MEDIASITE_BASE_EMBED, MEDIASITE_BASE_URL, domMediaSite);
	}
}

class YouTube extends Video {

	constructor (domYouTube, intTeller) {
		super (YOUTUBE, YOUTUBE_BASE_EMBED, YOUTUBE_BASE_URL, domYouTube);
	}
}

class MSStream extends Video {

	constructor (domMSStream, intTeller) {
		super (STREAM, STREAM_BASE_EMBED, STREAM_BASE_URL, domMSStream);
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class DownloadLink extends Blended {

	constructor (domDownload) {

		var blnIsRelativeLink = (domDownload.getAttribute ('download-root') == 'relative' ? true : false);
		var strLink = domDownload.getAttribute ('download-link');

		if (blnIsRelativeLink) {
			strLink = strRootDir + addSlashIfNeeded (strLink);
		}

		super (domDownload, DOWNLOAD, '', '', strLink);
	}

	addURLForNewTab () {}
	
	embedContent () {}

	getToggleActivator () {
		return '<div>';
	}

	getVisibleContent () {
		return 'Download <em><a href="' + this.strLink + '" class="videoLink">' + this.strTitle + '</a></em>';
	}

	getInvisibleContent () {
		return '';
	}

	getIconHTML () {
		return super.getIconHTML (DOWNLOAD);
	}

}

// /////////////////////////////////////////////////////////////////////////// //

class Quiz extends Blended {

	removeLoading () {

		var domLoading = this.domBlendedElement.querySelector ('.loading');
		var domIFrame = this.domBlendedElement.querySelector ('iframe');

		if (domLoading) {
			domLoading.remove ();
			domIFrame.removeEventListener ('load', this.removeLoading (), true);
			domIFrame.removeEventListener ('load', this.removeLoading (), false);
		}

	}

	constructor (domQuiz, strType, strEmbed, strTekst) {

		super (domQuiz, QUIZ, strType, strEmbed, strEmbed, 'Quiz wordt geladen...');
		var objQuiz = this;

		var domToelichting = document.createElement ('p');
		domToelichting.innerHTML = strTekst;
		domQuiz.before (domToelichting);

		/*
		 * Deze code wordt uitgevoerd om ervoor te zorgen dat 'Quiz wordt geladen' wordt
		 * verwijderd (omdat de pagina's van Wooclap gedeeltelijk transparent zijn).
		 */
		var domIFrame = document.querySelectorAll ('.quiz-wrapper iframe') [0];
		domIFrame.addEventListener ('load', objQuiz.removeLoading ());
	}

	getIconHTML () {
		return super.getIconHTML ('Proeftoets');
	}
}

class Wooflash extends Quiz {

	constructor (domWooflash, strTekst) {
		domWooflash.classList.add (WOOFLASH + '-wrapper');
		var strEmbed = Placeholder.replacePlaceholderInTekst (WOOFLASH_BASE_EMBED, '%id', domWooflash.getAttribute (WOOFLASH + '-id'));
		strTekst += ' (het nadeel van Wooflash is wel dat je hiervoor alleen in kunt loggen met een account dat je ' + 
		            'aanmaakt bij Wooflash en dat je dit account dus niet kunt gebruiken voor bijv. Wooclap).';
		super (domWooflash, 'deze proeftoets', strEmbed, strTekst);
	}
}

class Wooclap extends Quiz {

	constructor (domWooclap, strType, strTekst) {
		domWooclap.classList.add (WOOCLAP + '-wrapper');
		var strEmbed = Placeholder.replacePlaceholderInTekst (WOOCLAP_BASE_EMBED, '%link', domWooclap.getAttribute (WOOCLAP + '-dir'));
		strTekst += ' (voor Wooclap log je in met je student-account. Je hoeft dus niet opnieuw ' + 
					' in te loggen als je deze ' + 
		            ((strType == QUIZVRAAG) ? 'proeftoets wilt doorlopen' : 'vra(a)g(en) beantwoordt') + ').';
		super (domWooclap, strType, strEmbed, strTekst);
	}
}

class Quizvraag extends Wooclap {

	constructor (domVraag) {
		var strTekst = 'Zou je nu nog een paar vragen willen beantwoorden? Ik gebruik jullie antwoorden bij de voorbereiding van het hoorcollege';
		super (domVraag, QUIZVRAAG, strTekst);
	}
}

class Proeftoets {

	get arrProeftoetsen () {

		if (!this._arrProeftoetsen) {
			this._arrProeftoetsen = [];
		}

		return this._arrProeftoetsen;
	}

	constructor (domProeftoets) {

		var strTekst = 'Tijdens het hoorcollege liepen we samen door een proeftoets heen die helpt om actief met de stof bezig te zijn. ' +
			      	   'Na afloop van het hoorcollege kun je deze proeftoets hieronder opnieuw doorlopen.';
		var strTekstEnkelvoudig = strTekst + '<br><br>Daarvoor is een %type beschikbaar %beschrijving';
		var strWooclapTekst = strTekstEnkelvoudig;
		var strWooflashTekst = 'Het voordeel van een Wooflash-quiz t.o.v. een Wooclap is dat je een Wooflash meerdere keren kunt doorlopen en ' +
		     			   'dat je tussentijds een indicatie krijgt in hoeverre je na het doorlopen van de vragen klaar bent voor een ' +
		     			   'toets over deze stof'
		var domWooclap = domProeftoets;
		var domWooflash = domProeftoets;

		var strWooclapDir = domProeftoets.getAttribute (WOOCLAP + '-dir');
		var strWooflashID = domProeftoets.getAttribute (WOOFLASH + '-id');

		if (strWooclapDir) {

			if (strWooflashID) {
				strWooclapTekst = Placeholder.replacePlaceholderInTekst (strWooclapTekst, '%type', 'Wooclap-quiz');
				strWooclapTekst = Placeholder.replacePlaceholderInTekst (strWooclapTekst, '%beschrijving', 'die je eenmalig kunt doorlopen');

				strWooflashTekst = 'Deze proeftoets is ook als Wooflash-quiz beschikbaar. ' + strWooflashTekst;
				domWooflash = document.createElement ('div');
				domWooflash.setAttribute ('wooflash-id', strWooflashID);
				domWooclap.after (domWooflash);
			}
			else {
				strWooclapTekst = strTekst + '<br><br>Hiervoor wordt gebruik gemaakt van een Wooclap-quiz';
			}
		}
		else {
			strWooflashTekst = strTekst + '<br><br>Hiervoor wordt gebruik gemaakt van een Wooflash-quiz. ' + strWooflashTekst;
		}

		if (strWooclapDir) { 
			this.arrProeftoetsen.push (new Wooclap (domWooclap, PROEFTOETS, strWooclapTekst));
		}

		if (strWooflashID) { 
			this.arrProeftoetsen.push (new Wooflash (domWooflash, strWooflashTekst));
		}
	}

	embedContent () {

		this.arrProeftoetsen.forEach (objProeftoets => {
			objProeftoets.embedContent ();
		});
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class Uitwerking extends Blended {

	constructor (preUitwerking) {
		var domUitwerking = document.createElement ('div');
		super (domUitwerking, UITWERKING);
		preUitwerking.parentNode.insertBefore (domUitwerking, preUitwerking);
		var domBlendedContent = this.domBlendedElement.querySelector ('.blended-content');
		var domPre = domBlendedContent.querySelector ('pre');
		domBlendedContent.replaceChild (preUitwerking, domPre);

		// super (domUitwerking, UITWERKING) //, '<span id="dom-' + UITWERKING + '"></span>');
		// document.getElementById ('dom-' + UITWERKING).outerHTML = 
		//			Placeholder.replacePlaceholdersInTitle ('de uitwerking van %t %p', '', this.strParagraph);
	}

	addURLForNewTab () {}
	
	embedContent () {}

	getInvisibleContent () {
		return '<pre></pre>';
	}

	getIconHTML () {
		return super.getIconHTML ('Uitwerking');
	}
}

// /////////////////////////////////////////////////////////////////////////// //
