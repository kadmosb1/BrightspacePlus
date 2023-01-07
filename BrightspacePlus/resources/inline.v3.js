/* 
 * TODO's:
 *
 * Video's, Wooclaps, PDF's en presentaties pas laden nadat alles is opgemaakt.
 * PPTX-viewer toevoegen.
 * Waiting for toevoegen aan div's.
 * Overstappen naar <pre> (zonder extra class) als kenmerk van de uitwerking van een opdracht.
 * Overstappen naar <div blended...>, <div faq...>, div etc.
 * FAQ met keuze voor wel of niet tegelijk items openzetten.
 * active-class voor FAQ hernoemen naar faq-active.
 - Cookie voor instelling FAQ.
 * Classes toevoegen voor PDF en PPTX.
 * Objecten voor PDF en PPTX toevoegen aan arrContent [].
 * Strategy Pattern gebruiken om blended elementen om te vormen naar de juiste opmaak en content.
 - Classes nu ook toepassen voor video, wooclap, download etc..
 - Objecten toevoegen aan arrContent [].
 - content [] verwijderen
 - arrContent al vullen als paragrafen worden geteld en ook de blended elementen worden langsgelopen.
 - Alle variabelen met elm... hernoemen naar dom...
 * Gemeenschappelijke elementen bij het aanmaken van boxen in methodes onderbrengen.
 * Het uitkleden van het toevoegen van blended div's, zodat alleen de elmentID in eerste instantie wordt
   meegegeven en in de verschillende functions de gegevens worden uitgelezen uit de div.
 - Voor het toggelen van blended elementen een class introduceren, zodat JavaScript kleiner kan.
 * Combinatie van Tags en Attributes implementeren en getElementsByTagName -> getElementsByName: zowel
   voor h2, h3 etc. als voor blended, faq etc.. Daarbij moeten ook class='blended-wrapper' nog worden
   meegenomen.
 - Overal consequent CONSTANTES gebruiken (zowel in HTML, in CSS, in Blended als in JavaScript)
 - Inhoudsopgave gelijk maken aan div inhoudsopgave.
 * Lijst met filmpjes gelijk maken aan div video-list met een div.
 - Volgorde van het aanmaken controleren en dubbele loops killen waar mogelijk.
 - Is het aanmaken van de links op de juiste plek opgenomen?
 * Aanmaken titels voor het creëren van paragraafnummers.
 * PDF-viewer toggable maken.
 - PDF-viewer op 100% laten openen.
 * PDF en Cheat Sheet in structuur onderbrengen.
 - Student kan voor de paragrafen kiezen voor 1 tegelijk open of alles tegelijk open met een toggle-bar geleend
   van BrightSpace.
 - Blended voor Wooclap controleren en aanpassen (bijv. uitbreiden voor wooflash met voorbeeld).
 - Pas de constantes voor URL en EMBED zo aan dat de %id in de link vervangen kan worden (zoals bij de pptx).
 * Waiting for toevoegen aan div voor PDF.
 - Alle bovenstaande stappen controleren voor inhoudsopgave, lijst met films, content voor video, wooclap, 
   uitwerking van een opdracht, download-box, FAQ, PPTX en PDF.
 - Opruimen code-smells.
 - Opruimen oude code die overbodig is geworden.
 * Waiting for toevoegen aan div voor PPTX.
 */

// /////////////////////////////////////////////////////////////////////////// //

const EXECUTE_TEST = false;

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
var elmCSS = document.createElement ('link');
var strCSSFileName = strRootDir + '/resources/brightspace.v3.css';

elmCSS.rel = 'stylesheet';
elmCSS.type = 'text/css';
elmCSS.href = strCSSFileName;
elmCSS.media = 'all';
document.head.appendChild (elmCSS);

elmCSS.addEventListener ("load", () => { logMessage ('css', strCSSFileName, false); });
elmCSS.addEventListener ("error", (ev) => { logMessage ('css', strCSSFileName, true); });

// /////////////////////////////////////////////////////////////////////////// //

const INHOUDSOPGAVE = 'inhoudsopgave';
const VIDEOLIST = 'video-list';
const MEDIASITE = 'mediasite';
const STREAM = 'stream';
const YOUTUBE = 'youtube';
const ANSWER = 'answer';
const WOOCLAP = 'wooclap';
const WOOFLASH = 'wooflash';
const DOWNLOAD = 'download';
const FAQ = 'faq';
const POWERPOINT = 'pptx';
const POWERPOINT_ONEDRIVE = POWERPOINT + '-onedrive';
const POWERPOINT_TEAMS = POWERPOINT + '-teams-of-sharepoint';
const PDF = 'pdf';

const VORIGE = 'vorige';
const VOLGENDE = 'volgende';

const EXTRA_STOF = 'extra:';

// /////////////////////////////////////////////////////////////////////////// //

const MEDIASITE_BASE_URL = 'https://hhs.mediamission.nl/Mediasite/Play';
const MEDIASITE_BASE_EMBED = MEDIASITE_BASE_URL;
const STREAM_BASE_URL = 'https://web.microsoftstream.com/video';
const STREAM_BASE_EMBED = 'https://web.microsoftstream.com/embed/video';
const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v=';
const YOUTUBE_BASE_EMBED = 'https://www.youtube.com/embed';
const WOOCLAP_BASE_EMBED = 'https://app.wooclap.com';
const WOOFLASH_BASE_EMBED = 'https://app.wooflash.com/study';
const ONEDRIVE_BASE_URL = 'https://dehaagsehogeschool-my.sharepoint.com/personal/%account/_layouts/15/Doc.aspx?sourcedoc={%id}';
const ONEDRIVE_BASE_EMBED = ONEDRIVE_BASE_URL + '&amp;action=embedview&amp;wdAr=1.7777777777777777';
const TEAMS_OF_SP_BASE_URL = 'https://dehaagsehogeschool.sharepoint.com/sites/%site/_layouts/15/Doc.aspx?sourcedoc={%id}';
const TEAMS_OF_SP_BASE_EMBED = TEAMS_OF_SP_BASE_URL + '&amp;action=embedview&amp;wdAr=1.7777777777777777';

// /////////////////////////////////////////////////////////////////////////// //

const BLENDED_WRAPPER = 'blended-wrapper';

// /////////////////////////////////////////////////////////////////////////// //

const FAQActions = {
	select: 'select',
	expand: 'expand',
	minify: 'minify'
}

// /////////////////////////////////////////////////////////////////////////// //

/* 
 * Deze array wordt gebruikt om alle wrappers in op te slaan (waarin vids, uitwerkingen
 * e.d. worden toegevoegd), zodat ze - als de pagina helemaal geladen is - gevuld
 * kunnen worden met relevante content.
 *
 * Elk element bevat een array die qua aantal elementen en qua inhoud afhangt van het type van de blended wrapper.
 * Voor alle arrays geldt dat de id van het element als eerste element is toegevoegd. Daarna worden de volgende 
 * elementen toegevoegd (het totaal aantal elementen (incl. het id) is tussen haakjes toegevoegd):
 *
 * - Voor Mediasite (5): id van de video, paragraaf, titel en zichtbaarheid.
 * - Voor MS Stream (5): idem.
 * - Voor YouTube (5): idem.
 * - Voor Wooclap (4): directory van de Wooclap, het type en de zichtbaarheid.
 * - Voor een downloadlink (4): of de link relatief is, de link zelf en de zichtbare titel in de link.
 * - Voor een FAQ (4): de werkvorm, het niveau van de header en een titel.
 * - Voor een PPTX (5): de id van de PPTX en een account (voor OneDrive) en een site (voor Teams/SharePoint)
 *   (waarbij één van beiden leeg is) en de zichtbaarheid.
 * - Voor de uitwerking van een opdracht (3): het nummer van de paragraaf en de zichtbaarheid.
 */
let content = [];

/*
 * Vanaf 17 december 2022 stap ik langzaam over naar een array met objecten.
 */
let arrContent = [];

// /////////////////////////////////////////////////////////////////////////// //

class Cookie {

	/*
	 * Geeft de cookie met key de waarde in value en past daarop meegegeven opties toe.
	 */
	static set (key, value, options = {}) {

		/*
		 * Als de cookie moet verlopen (verwijderd moet worden), wordt de max-age
		 * verwijderd krijgt expires de waarde van gisteren.
		 */
		if (!options ["max-age"]) {
			options ["max-age"] = 31 * 24 * 60 * 60;
		}

		options.path = '/';
//		options.domain = 'brightspace.hhs.nl';

		let updatedCookie = encodeURIComponent (key) + "=" + encodeURIComponent (value);

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
    			"(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  			)
  		);

  		return matches ? decodeURIComponent (matches [1]) : undefined;
	}

	/* 
	 * Verwijder de cookie met de meegegeven key.
	 */
	static delete (key) {
  		Cookie.set (name, "", {'max-age': -1});
	}
}

Cookie.set ('kadmosb', 'test');
console.log ('Cookies: ' + document.cookie);

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Geef het element met de tag h2, h3 of h4 en het gewenste paragraafnummer terug.
 */

function getElementMetParagraafnummer (strParagraph) {

	if (strParagraph) {

		for (const elmH of getElementsByNames ('h2,h3,h4')) {

			if (elmH.getAttribute ('paragraph') == strParagraph) {
				return elmH;
			}
		}
	}

	return null;
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Alle wrappers krijgen een id die bestaat uit strType gevolgd door '-' en de 
 * teller (waarin is bijgehouden in welke volgorde de wrappers op de pagina staan).
 * 
 * strBlendedID kan vervolgens in de aanroepende methode gebruikt worden om
 * te refereren naar deze wrapper.
 */
function setIDForBlendedElement (strType, divBlended, intTeller) {
	var strBlendedID = strType + '-' + intTeller;
	divBlended.setAttribute ('id', strBlendedID);
	return strBlendedID;
}

/*
 * Alle wrappers krijgen eerst een id die bestaat uit de relevante constante
 * (MEDIASITE, ANSWER etc., zoals hierboven gedefinieerd), gevolgd door een 
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
 * De placeholder (bijv. %t) in tekst wordt vervangen door een replacement.
 */
function replacePlaceholderInTekst (strTekst, strPlaceholder, strReplacement) {

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
function replaceTypeInTekst (strTekst, strType) {
	return replacePlaceholderInTekst (strTekst, "%t", strType);
}

/*
 * %p in een titel wordt vervangen door een paragraaf. Als paragraaf het woord 'Hoofdstuk'
 * bevat wordt dit verwijderd.
 */
function replaceParagraphInTekst (strTekst, strParagraph) {
	strTekst = replacePlaceholderInTekst (strTekst, "%p", strParagraph);
	return replacePlaceholderInTekst (strTekst, "Hoofdstuk", "");
}

/*
 * De palceholders %t en %p in een titel worden vervangen door het type en de nummering
 * van een paragraaf waarnaar wordt verwezen.
 */
function replacePlaceholdersInTekst (strTekst, strType, strParagraph) {

	if (strTekst) {
		strTekst = replaceTypeInTekst (strTekst, strType);
		return replaceParagraphInTekst (strTekst, strParagraph);
	}

	return "";
}

/*
 * Gebaseeerd op het paragraafnummer wordt het type van de betreffende paragraaf bepaald 
 * en worden in de titel %p en %t vervangen door deze paragraaf en dit type.
 */
function replacePlaceholdersInTitle  (strTitle, strType, strParagraph) {

	if (!strType) {

		strType = "";
		var elmMetParagraaf = getElementMetParagraafnummer (strParagraph);

		if (elmMetParagraaf) {
			
			strType = elmMetParagraaf.getAttribute ('type');

			if (!strType) {

				switch (elmMetParagraaf.tagName.toLowerCase ()) {
					case "h2": strType = 'hoofdstuk'; break;
					case "h3":
					case "h4": strType = 'paragraaf'; break;
				}
			}
		}
	}

	return replacePlaceholdersInTekst (strTitle, strType, strParagraph);
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

	for (const elmElement of arrElements) {
		arrResults.push (elmElement);
	}
}

/*
 * Met deze functie worden de elementen met een specifieke tagname toegevoegd aan
 * een array met elementen.
 */
function addElementsWithTagToArray (elmRoot, strTagName, arrResults) {
	addElementsToArray (elmRoot.getElementsByTagName (strTagName), arrResults);
}

function addElementsWithAttributeToArray (elmRoot, strAttributeName, arrResults) {
	addElementsToArray (elmRoot.querySelectorAll ('[' + strAttributeName + ']'), arrResults);
}

function addElementsWithClassToArray (elmRoot, strClassName, arrResults) {
	addElementsToArray (elmRoot.getElementsByClassName (strClassName), arrResults);
}

function addFAQElementsToArray (elmRoot, strType, arrResults) {
	addElementsToArray (elmRoot.querySelectorAll ('[werkvorm]'), arrResults);
}

/*
 * Bij Answer-elements gaat het om elementen met de tag pre, waarin de uitwerking
 * van een opdracht getoond moet worden.
 */
function addElementsForAnswerToArray (elmRoot, arrResults) {

	var arrAnswerElements = [];

	/*
	 * Een element met de tag 'pre' bevat de uitwerking van een opdracht als 
	 * voor het betreffende element óf geen class is gedefinieerd óf minimaal 
	 * de class 'blended-wrapper' is gedefinieerd.
	 * In dat geval moet het element worden toegevoegd aan de lijst met elementen 
	 * waarin een uitwerking moet worden getoond.
	 */ 
	for (elmPre of elmRoot.getElementsByTagName ('pre')) {

		if (!elmPre.hasAttribute ('class')
		    ||
		    elmPre.classList.contains ('blended-wrapper')) {
			arrAnswerElements.push (elmPre);
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
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, ANSWER); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, DOWNLOAD); 	
		strToevoeging = voegStringToeAanKommaGescheidenString (strToevoeging, FAQ); 	
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
function getElementsByNames (strNames, elmRoot = document) {

	strNames = voegBlendedNamenToe (strNames);
	var arrNames = strNames.split (',');
	var arrResults = new Array ();

	for (var strName of arrNames) {

		switch (strName.toLowerCase ()) {

			case 'blended':
			case 'h2':
			case 'h3':
			case 'h4':
				addElementsWithTagToArray (elmRoot, strName, arrResults);
				break;

			case FAQ:
				addFAQElementsToArray (elmRoot, FAQ, arrResults);
				break;

			case WOOCLAP:
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
				addElementsWithAttributeToArray (elmRoot, strName, arrResults);
				break;

			case 'pre':
				addElementsForAnswerToArray (elmRoot, arrResults);
				break;
		}
	}

	var elmTest = arrResults [0];

	if (!elmTest) {
		return [];
	}

	if (elmTest.sourceIndex) {

		arrResults.sort (function (a, b) {
			return a.sourceIndex - b.sourceIndex;
		});
	}
	else if (elmTest.compareDocumentPosition) {

		arrResults.sort (function (a, b) {
			return 3 - (a.compareDocumentPosition (b) & 6);
		});
	}

	return arrResults;
}

/*
 * Test de function getElementsByNames.
 */
if (EXECUTE_TEST) {

	for (const elmElement of getElementsByNames ('h2,h3,h4,blended')) {
		console.log ('Test getElementsByNames: ' + elmElement.tagName + ' - ' + elmElement.innerHTML);
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Het element wordt (op dezelfde plek in de hiërarchie) vervangen door een wrapper
 * waarna het bestaande element aan de wrapper wordt toegevoegd.
 */
function addWrapperToElement (elmElement, strTagForWrapper, blnCopyAttributes = false) {
	var elmParent = elmElement.parentNode;
	var elmWrapper = document.createElement (strTagForWrapper);
	elmParent.replaceChild (elmWrapper, elmElement);
	elmWrapper.appendChild (elmElement);
}

/*
 * Vervang het element door een vergelijkbaar element met een andere tagname.
 */
function replaceTagName (elmElement, strNewTagName) {

	/*
	 * De oude TagName wordt zowel in de start- als in de eindtag (zowel <div> als </div>) vervangen
	 * door de nieuwe TagName.
	 */
	var strOldTagName = elmElement.tagName.toLowerCase ();
	var strOuterHTML = elmElement.outerHTML;
	strOuterHTML = strOuterHTML.replace ('<' + strOldTagName, '<' + strNewTagName);
	strOuterHTML = strOuterHTML.replace (strOldTagName + '>', strNewTagName + '>');

	/*
	 * De nieuwe node wordt toegevoegd op de plek van de oude node.
	 */ 
	elmElement.insertAdjacentHTML ('afterend', strOuterHTML);
	var elmNew = elmElement.nextSibling;
	elmElement.parentElement.removeChild (elmElement);

	return elmNew;
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Als het hele HTML-document geladen is, worden de blended divs gevuld met
 * de juiste content en opgemaakt.
 */
window.onload = function (event) {

	/*
	 * De h2's, h3's, en h4's worden gevuld met de juiste paragraafnummers en de blended
	 * wrappers krijgen het paragraafnummer van de paragraaf waarin ze voorkomen.
	 */
	addCorrectParagraphNumbersToDocument ();

	/* 
	 * Voeg extra informatie (zoals target of gewijzigde titel) toe aan de links in de pagina.
	 */
	updateLinks ();

    /*
     * Alle wrappers worden gekenmerkt door de class 'blended-wrapper'. 
     * Alle wrappers krijgen een id en relevante gegevens worden tijdelijk 
     * opgeslagen in de array content, zodat de wrappers in een volgende loop
     * kunnen worden gevuld met de juiste content.
     */
	var teller = 1;

    for (const divBlended of document.getElementsByClassName (BLENDED_WRAPPER)) {

    	// Van toggable wrappers kan worden ingesteld dat ze bij de start zichtbaar zijn (of niet)
    	var strVisibility = divBlended.getAttribute ('visible');
    	var blnVisibility = true;

    	if (strVisibility != "true") {
    		blnVisibility = false;
    	}

    	var strTitle = divBlended.getAttribute ('title');
    	// Alleen wrappers met de uitwerking van een opdracht hebben geen mediasite-id,
    	// maar wel een paragraph.
    	var strParagraph = divBlended.getAttribute ('paragraph');
    	strTitle = replacePlaceholdersInTitle (strTitle, '', strParagraph);

    	// Alleen video-wrappers voor Mediasite hebben het kenmerk 'mediasite-id'.
    	var strMediasiteID = divBlended.getAttribute (MEDIASITE + '-id');
    	// Alleen video-wrappers voor MS Stream hebben het kenmerk 'stream-id'.
    	var strStreamID = divBlended.getAttribute (STREAM + '-id');
    	// Alleen video-wrappers voor YouTube hebben het kenmerk 'youtube-id'.
    	var strYoutubeID = divBlended.getAttribute (YOUTUBE + '-id');
    	// Alleen wooclap-wrappers hebben het kenmerk 'wooclap-dir'.
    	var strWooclapDir = divBlended.getAttribute (WOOCLAP + '-dir');
    	// Alleen download-wrappers hebben het kenmerk 'download-link'.
    	var strDownloadLink = divBlended.getAttribute (DOWNLOAD + '-link');
    	// Alleen een FAQ heeft het kenmerk 'werkvorm'.
    	var strWerkvorm = divBlended.getAttribute ('werkvorm');
		// Alleen een PowerPoint kan het kenmerk 'pptx-id' hebben.
		var strPPTXID = divBlended.getAttribute (POWERPOINT + '-id');
		// Alleen een PDF kan het kenmerk 'pdf' hebben.
		var strPDFLink = divBlended.getAttribute (PDF);

        /*
         * Voor een mediasite-wrapper wordt naast paragraaf en mediasite-id ook
         * de title tijdelijk in de array content opgeslagen.
         */
    	if (strMediasiteID) {
    		var strBlendedID = setIDForBlendedElement (MEDIASITE, divBlended, teller++);
    		content.push ([strBlendedID, strMediasiteID, strParagraph, strTitle, blnVisibility]);
    	}

        /*
         * Voor een mediasite-wrapper wordt naast paragraaf en mediasite-id ook
         * de title tijdelijk in de array content opgeslagen.
         */
        else if (strStreamID) {
    		var strBlendedID = setIDForBlendedElement (STREAM, divBlended, teller++);
    		content.push ([strBlendedID, strStreamID, strParagraph, strTitle, blnVisibility]);
        }

        /*
         * Voor een youtube-wrapper wordt naast paragraaf en youtube-id ook
         * de title tijdelijk in de array content opgeslagen.
         */
        else if (strYoutubeID) {
    		var strBlendedID = setIDForBlendedElement (YOUTUBE, divBlended, teller++);
    		content.push ([strBlendedID, strYoutubeID, strParagraph, strTitle, blnVisibility]);
        }

        /*
         * Voor een wooclap-wrapper wordt naast de wooclap-dir ook het type
         * tijdelijk in de array content opgeslagen.
         */
    	else if (strWooclapDir) {
    		var strBlendedID = setIDForBlendedElement (WOOCLAP, divBlended, teller++);
    		var strType = divBlended.getAttribute ('type');
    		content.push ([strBlendedID, strWooclapDir, strType, blnVisibility]);
    	}

    	/*
         * Voor een download-wrapper worden naast de download-link ook download-root
         * en title tijdelijk in de array content opgeslagen.
         */
    	else if (strDownloadLink) {
    		var strBlendedID = setIDForBlendedElement (DOWNLOAD, divBlended, teller++);
    		var blnIsRelativeLink = divBlended.getAttribute (DOWNLOAD + '-root') == 'relative' ? true : false;
    		content.push ([strBlendedID, blnIsRelativeLink, strDownloadLink, strTitle]);
    	}

    	/*
    	 * Voor een lijst met vragen en antwoorden (FAQ) is alleen de werkvorm relevant.
    	 */
    	else if (strWerkvorm) {
    		var strBlendedID = setIDForBlendedElement (FAQ, divBlended, teller++);
    		var strHeader = divBlended.getAttribute ('header');
    		content.push ([strBlendedID, strWerkvorm, strHeader, strTitle]);
    	}

		/*
		 * Voor een PowerPoint-presentatie is een pptx-id bekend. Daarom wordt een 
		 * PowerPoint-object aangemaakt.
		 */
		else if (strPPTXID) {
			arrContent.push (new PowerPoint (divBlended));

			// var strBlendedID = setIDForBlendedElement (POWERPOINT, divBlended, teller++);
			// var strAccount = divBlended.getAttribute ('account');
			// var strSite = divBlended.getAttribute ('site');
			// content.push ([strBlendedID, strPPTXID, strAccount, strSite, blnVisibility])
		}

		/*
		 * Voor een PDF-document is een pdf bekend. Daarom wordt een PDFDocument-object
		 * aangemaakt.
		 */
		else if (strPDFLink) {
			arrContent.push (new PDFDocument (divBlended));
		}
    	/*
         * Voor een wrapper met de uitwerking van een opdracht wordt alleen de 
         * paragraaf tijdelijk in de array content opgeslagen.
         * Omdat ook de 
         */
    	else if ((!divBlended.classList.contains (INHOUDSOPGAVE + '-wrapper')
    		     &&
    		     strParagraph)) {
    		var strBlendedID = setIDForBlendedElement (ANSWER, divBlended, teller++);
    		content.push ([strBlendedID, strParagraph, blnVisibility]);
    	}
	}

    /*
     * Als er wrappers op de pagina staan, worden die nu gevuld met de content.
     */
	if (content.length > 0) {

		content.forEach (arrBlended => {

			switch (getTypeBasedOnElementID (arrBlended [0])) {
				case MEDIASITE: addVideoContent (MEDIASITE, arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3], arrBlended [4]); break;
				case STREAM: addVideoContent (STREAM, arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3], arrBlended [4]); break;
				case YOUTUBE: addVideoContent (YOUTUBE, arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3], arrBlended [4]); break;
				case WOOCLAP: addWooclapContent (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3]); break;
				case ANSWER: makeAnswerToggable (arrBlended [0], arrBlended [1], arrBlended [2]); break;
				case DOWNLOAD: createDownloadContainer (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3]); break;
				case FAQ: createFAQ (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3]); break;
				case POWERPOINT: addPowerPointContent (POWERPOINT, arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3], arrBlended [4]); break;
				default: console.log ('Unknown blended wrapper found');
			}
		});

		arrContent.forEach (objBlended => {
			objBlended.createElement ();
		});

		/*
		* Deze code wordt uitgevoerd om ervoor te zorgen dat 'Quiz wordt geladen' wordt
		* verwijderd (omdat de pagina's van Wooclap gedeeltelijk transparent zijn).
		*/
		for (const elmWooclapIFrame of document.querySelectorAll ('.wooclap-wrapper iframe')) {

			elmWooclapIFrame.addEventListener ('load', function () {
				this.parentNode.querySelector ('.loading').remove ();
			});
		}
	
		// PDFDocument.createViewersVoorCodeSmellCheatSheets ();
		// createPDFViewers ();
		addSourceToBlendedElements ();

		if (EXECUTE_TEST) {
			testFAQSetup ();
		}
	}
};

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Als op de pagina een inhoudsopgave moet worden getoond, worden nu een titel
 * en de tabel voor de inhoudsopgave toegevoegd.
 */
function toonInhoudsopgave (elmInhoud) {

	if (elmInhoud) {

		elmInhoud.classList.add (BLENDED_WRAPPER);
		elmInhoud.classList.add (INHOUDSOPGAVE + '-wrapper');
		setIDForBlendedElement (INHOUDSOPGAVE, elmInhoud, 0);

		/*
		 * De initiële zichtbaarheid van de inhoudsopgave (toggle is open) wordt
		 * als css-stijl ingesteld op de (on-)zichtbare content.
		 */
		var blnVisibility = ((elmInhoud.getAttribute ('visible') == 'true') ? true : false);
		elmInhoud.removeAttribute ('visible');

		var strElementID = elmInhoud.id;
		var strVisibleContent = 'Klik <em><a class="videoLink">hier</a></em> om de inhoudsopgave (on-)zichtbaar te maken.';
		var strInvisibleContent = '<table id="tabel-inhoud" class="' + INHOUDSOPGAVE.toLowerCase () + '">' +
		                          '    <tr><td></td><td></td></tr>' +
		                          '</table>';
	    elmInhoud.innerHTML = getToggleWrapper (strElementID, INHOUDSOPGAVE, strVisibleContent, strInvisibleContent, blnVisibility);

	    var elmTitle = document.createElement ('h2');
	    elmTitle.innerText = INHOUDSOPGAVE.charAt (0).toUpperCase () + INHOUDSOPGAVE.slice (1);
	    elmTitle.id = 'h2-inhoud';
	    elmTitle.setAttribute ('nummering', 'no');
	    elmTitle.setAttribute ('studietijd', 'totaal');
	    elmInhoud.parentNode.insertBefore (elmTitle, elmInhoud);
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Met deze functie wordt het aantal minuten voor een element met studietijd,
 * studietijd-optelling of studietijd-totaal bepaald.
 */
function getStudietijd (elmH) {

	var strStudietijd = elmH.getAttribute ('studietijd');

	if (strStudietijd) {

		if (strStudietijd.includes (EXTRA_STOF)) {
			strStudietijd = strStudietijd.slice (EXTRA_STOF.length);
		}

		if (!isNaN (strStudietijd)) {
			return parseInt (strStudietijd);
		}
		else {
			return -1;
		}
	}
	else {
		return 0;
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van het aantal minuten wordt een geschreven tekst in (halve) uren,
 * kwartieren en minuten opgemaakt.
 */
function getGeschrevenTijd (intAantalMinuten) {

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

/*
 * Test de functie getGeschrevenTijd.
 */
if (EXECUTE_TEST) {

	var strTijden = "0,1,2,14,15,16,29,30,31,44,45,46,59,60,61,62,74,75,76,89,90,91,104,105,106,119,120,121,122,x";
	var arrTijden = strTijden.split (',');

	for (var strTijd of arrTijden) {

		strTijd = "  " + strTijd;
		strTijd = strTijd.substring (strTijd.length - 3);
		console.log (strTijd + ' minuten: ' + getGeschrevenTijd (strTijd));
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Voeg een element toe na elmH, waarin een studietijd wordt vermeld.
 */
function addElementMetStudietijd (elmH, strParagraph, strTekst) {
	elmTijd = document.createElement ('div');
	elmTijd.classList.add ('blended-tijd');
	elmTijd.setAttribute ('paragraph', strParagraph);
	elmTijd.innerHTML = strTekst;
	elmH.parentNode.insertBefore (elmTijd, elmH.nextSibling);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * In deze functie wordt de totale studietijd (inclusief extra tijd) getoond in
 * de div met class 'blended-tijd'.
 */

function toonToetsEnExtraStudietijd (elmH, strParagraph, strType, intSom, intExtraSom) {

	var strInhoudStudietijd;
	var strEenheid;

	if (strType == 'som') {
		strEenheid = 'in ' + ((elmH.tagName.toLowerCase () == 'h2') ? 'dit hoofdstuk' : 'deze paragraaf');
	}
	else if (strType == 'totaal') {
		strEenheid = ('op deze pagina');
	}

	strInhoudStudietijd = '<span class="melding">Studietijd voor de toetsstof ' + strEenheid + ': ';

	if (intSom > 0) {
		strInhoudStudietijd += getGeschrevenTijd (intSom) + '</span>';
	}
	else {

		if (intExtraSom > 0) {
			strInhoudStudietijd += '0 minuten';
		}
		else {
			strInhoudStudietijd = '&nbsp;';
		}
	}

	if (intExtraSom > 0) {
		strInhoudStudietijd = '<span class="melding">' + strInhoudStudietijd + '</span>' +
							  '<span class="extraMaterial">' +
							  '    <br>' +
							  '    Studietijd voor de extra stof ' + strEenheid + ': ' +
							       getGeschrevenTijd (intExtraSom) + '<br>' + 
							  '    Totale studietijd voor de stof ' + strEenheid + ': ' + 
							       getGeschrevenTijd (intSom + intExtraSom) + 
							  '</span>';
	}

	addElementMetStudietijd (elmH, strParagraph, strInhoudStudietijd);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van de content van alle div's met de class 'blended-tijd' wordt deze
 * div gevuld met de juiste tijd (in uren, eventueel hele kwartieren en minuten)
 * en wordt rechts navigatie toegevoegd.
 */
function updateTijd (elmH, strParagraph, strTijdAttribuut) {

	var strTag = elmH.tagName;
	var strStudietijd = elmH.getAttribute ('studietijd');
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

			elmH.setAttribute ('paragraph', strParagraph);

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
						intStudietijd = getStudietijd (child);

						blnIsExtraStof && (intStudietijd > 0) ? intExtraSom += intStudietijd : intSom += intStudietijd;
					}
				}
			}

			toonToetsEnExtraStudietijd (elmH, strParagraph, 'som', intSom, intExtraSom);
			break;

		case 'totaal':

			var intSom = 0;
			var intExtraSom = 0;
			var blnIsExtraStof;

			for (const child of getElementsByNames ('h2,h3,h4')) {

				strStudietijd = child.getAttribute ('studietijd');

				if (strStudietijd) {

					blnIsExtraStof = strStudietijd.includes (EXTRA_STOF);
					var intStudietijd = getStudietijd (child);

					if (intStudietijd > 0) {
						blnIsExtraStof ? intExtraSom += intStudietijd : intSom += intStudietijd;
					}
				}
			}

			toonToetsEnExtraStudietijd (elmH, strParagraph, 'totaal', intSom, intExtraSom);
			break;

		default:

			blnIsExtraStof = strStudietijd.includes (EXTRA_STOF);

			if (blnIsExtraStof) {
				strStudietijd = strStudietijd.slice (EXTRA_STOF.length);
			}

			strSoortStudietijd = (blnIsExtraStof ? 'Studietijd extra stof (facultatief): ' : 'Studietijd toetsstof: ');
			strGeschrevenTijd = getGeschrevenTijd (strStudietijd);

			if (strGeschrevenTijd) {

				var strTekst = strSoortStudietijd + getGeschrevenTijd (strStudietijd);

				if (blnIsExtraStof) {
					strClass='extraMaterial';
				}
				else {
					strClass = 'melding';
				}

				strTekst = '<span class="' + strClass + '">' + strTekst + '</span>'
			
				addElementMetStudietijd (elmH, strParagraph, strTekst);
			}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Deze functie bepaalt de index van het huidige element in de lijst met 
 * elementen van het type h2, h3 of h4.
 */
function getIndexVanElementMetParagraafnummer (elmMetParagraaf, arrElements) {

	var intIndex = 0;

	for (const elmH of arrElements) {

		if (elmH == elmMetParagraaf) {
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
	var elmH = getElementMetParagraafnummer (strParagraph);
	var intIndex = getIndexVanElementMetParagraafnummer (elmH, arrH);

	/*
	 * Als de paragraaf voorkomt in de array navigatie, kan - afhankelijk van of op vorige of volgende is 
	 * geklikt - worden gezocht naar de vorige of volgende paragraaf waarvoor 'navigatie="yes"' is ingesteld.
	 */
	if (intIndex > -1) {

		var blnGevonden = false;
		
		intIndex += ((strRichting == "vorige") ? -1 : 1);

		while ((intIndex >= 0) && (intIndex < arrH.length)) {

			var elmNabijeH = arrH [intIndex];
			var strWelOfNiet = elmNabijeH.getAttribute ('navigatie');

			/*
			 * Test van de paragrafen waarnaar wordt gezocht.
			var strID = elmNabijeH.id;
			var strTitel = elmNabijeH.innerHTML;
			var strNavigatieParagraph = elmNabijeH.getAttribute ('paragraph');
			console.log (intIndex + ': ' + strNavigatieParagraph + ' - ' + strID + ' - ' + strTitel + ' (' + strWelOfNiet + ')');
			 */

			if (strWelOfNiet == "yes") {
				return elmNabijeH;
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
function getIcon (strType, strParagraph = "0") {

	var strIcon;
	var strInactief = '';
	var strURL = '';
	var strTitle = '';
	var elmInhoudsopgave = document.getElementById ('h2-inhoud');

	/*
	 * Als het type van de button 'inhoudsopgave' is, worden het icoontje en een eventuele
	 * link toegevoegd.
	 */
	if (strType == INHOUDSOPGAVE) {

		if (elmInhoudsopgave) {
			strURL = '#h2-inhoud';
			strTitle = INHOUDSOPGAVE;
		}
		else {
			strInactief = ' - Inactief';
		}
	}
	else {

		var elmVerwezenH = getVolgendeOfVorigeParagraaf (strParagraph, strType);

		/*
		 * Als een vorige of volgende paragraaf niet bestaat, wordt een grijs icoontje
		 * getoond en wordt geen link toegevoegd.
		 */
		if (elmVerwezenH) {
			strURL = '#' + elmVerwezenH.id;
			strTitle = elmVerwezenH.innerHTML;
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
	for (const elmParagraph of getElementsByNames ('h2,h3,h4')) {

		var strParagraph = elmParagraph.getAttribute ('paragraph');

		if (elmParagraph.getAttribute ('navigatie') == "yes") {

			elmVolgendeElement = elmParagraph.nextSibling;

			/*
			 * Als dit element nog niet bestaat, wordt een nieuw element aangemaakt.
			 */
			if (!elmVolgendeElement || !elmVolgendeElement.classList || !elmVolgendeElement.classList.contains ('blended-tijd')) {
				elmVolgendeElement = document.createElement ('div');
				elmVolgendeElement.classList.add ('blended-navigatie');
				elmVolgendeElement.setAttribute ('paragraph', strParagraph);
				elmVolgendeElement.innerHTML = '&nbsp;';
				elmParagraph.parentNode.insertBefore (elmVolgendeElement, elmParagraph.nextSibling);
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

			elmVolgendeElement.appendChild (divNavigatie);			
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
	toonInhoudsopgave (document.getElementById (INHOUDSOPGAVE));

	/*
	 * Als de titel voor een FAQ later wordt toegevoegd, wordt de paragraaf niet mee genummerd.
	 * Dat gebeurt dus op deze plek.
	 */
	for (var child of getElementsByNames (FAQ)) {
		var strNiveau = child.getAttribute ('header');
		var strTitle = child.getAttribute ('title');
		var elmTitel = document.createElement ('h' + (strNiveau ? strNiveau : '3'));
		elmTitel.innerHTML = (strTitle ? strTitle : 'FAQ');
		child.parentNode.insertBefore (elmTitel, child);
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
				 * Als er een inhoudsopgave is, wordt het hoofdstuk of de (sub-)paragraaf toegevoegd
				 * aan de inhoudsopgave.
				 */
				if (document.getElementById ("h2-inhoud")) {

					/*
					 * In de inhoudsopgave wordt boven elk hoofdstuk een lege regel getoond.
					 */
					if ((strTag == 'h2') && (intHoofdstuk > 1)) {
						trRegel = document.getElementById ('tabel-inhoud').insertRow (-1);
						trRegel.insertCell (0).innerHTML = '&nbsp;';
						trRegel.insertCell (1);
					}

					/*
					 * Het hoofdstuk of de (sub-)paragraaf wordt als laatste regel in de inhoudsopgave toegevoegd.
					 * Dat gebeurt natuurlijk alleen als voor een paragraaf niet is ingesteld dat 'inhoud' "no" is.
					 */
					var tdTitle;

					if (strInhoud != "no") {
						var trRegel = document.getElementById ('tabel-inhoud').insertRow (-1);
						trRegel.insertCell (0).innerHTML = '<a class="videoLink" style="border-bottom: none;" href="#' + strID + '">' + 
					    	                                   (strParagraph == 'no' ? "klik" : strParagraph) + 
					        	                           '</a>';
						tdTitle = trRegel.insertCell (1);
						tdTitle.innerHTML = child.innerHTML;
					}
				}

				/*
				 * Eventueel wordt het type van een hoofdstuk of (sub-)paragraaf aan de zichtbare titel toegevoegd
				 * en wordt dat type natuurlijk ook aan de titel in de inhoudsopgave toegevoegd.
				 */
				if (strType) {
					strType = strType.charAt (0).toUpperCase () + strType.slice (1);
					child.innerHTML =  strType + ' - ' + child.innerHTML;
					tdTitle ? tdTitle.innerHTML = strType + ' - ' + tdTitle.innerHTML : tdTitle = null;
				}

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
function getHuidigeParagraafID (elmHuidige) {

	/*
	 * Als het vorige element van het type h2, h3 of h4 is, geef dan de id terug.
	 * Anders zoek je terug in de lijst totdat je wel een h2, h3 of h4 tegenkomt.
	 */
	while (elmHuidige) {

		/*
		 * Neem het element voorafgaand aan het huidige element.
		 */
		var elmVorige = elmHuidige.previousElementSibling;
		var strTagname;
		var strID;

		if (!elmVorige) {
			elmVorige = elmHuidige.parentElement;
		}

		/*
		 * Als er geen vorig element is gevonden, wordt in de hiërarchie een niveau
		 * hoger gezocht naar het bijbehorende hoofdstuk of de (sub-)paragraaf.
		 */
		if (elmVorige) {
			strTagname = elmVorige.tagName.toLowerCase ();
		}

		/*
		 * Als het hoofdstuk of de (sub-)paragraaf is gevonden, wordt het id van
		 * het element teruggegeven (zodat de back-knop van de browser teruggaat naar de plek
		 * waar op de link werd geklikt).
		 * Anders wordt verder gezocht.
		 */
		if ((strTagname == 'h2') || (strTagname == 'h3') ||(strTagname == 'h4')) {
			return elmVorige.id;
		}
		else {
			return getHuidigeParagraafID (elmVorige);
		}
	}

	return 'onbekend';
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * De links op de pagina worden aangepast, zodat:
 *
 * - Een externe link naar een nieuwe pagina wordt geopend in een aparte tab.
 * - Aan een interne link (met een anker naar een id in de huidige pagina) wordt
 *   info toegevoegd zodat de link niet wordt geopend in een aparte pagina en
 *   zodat de back-knop van de browser teruggaat naar de plek van waaruit deze
 *   link werd aangeroepen.
 */

function updateLinks () {

	for (const elmA of document.getElementsByTagName ('a')) {

		var strHREF = elmA.getAttribute ('href');
		var strIDVanHuidigeParagraaf = getHuidigeParagraafID (elmA);

		/*
		 * Als het om een interne link gaat, wordt deze aangepast.
		 * Anders gaat het om een externe link en wordt de target zo ingesteld,
		 * dat de link een nieuw tabblad opent.
		 */
		if (strHREF 
			&& 
			(strHREF.charAt (0) == '#')) {

			var strID = strHREF.slice (1);
			var elmWithID = document.getElementById (strID);

			/*
			 * Als de link naar een bestaande id verwijst, wordt de interne link daarop
			 * aangepast. Anders wordt in ee log een melding geschreven dat de link niet
			 * geldig is.
			 */
			if (elmWithID) {

				var strType = elmWithID.getAttribute ('type');
				var strParagraph = elmWithID.getAttribute ('paragraph');
				var strTitle = elmA.getAttribute ('title');

				/*
				 * Als een titel is opgegeven, dan wordt %t door het type van het 
				 * gelinkte element vervangen en wordt %p door het nummer van de 
				 * gelinkte paragraaf vervangen.
				 *
				 * Het plaatje van de navigatie-buttons moet niet worden vervangen.
				 * (vandaar de tweede voorwaarde).
				 */
				if (strTitle && (!elmA.classList.contains ('navigatie-link'))) {
					strTitle = replacePlaceholdersInTitle (strTitle, strType, strParagraph);
					elmA.setAttribute ('title', strTitle);
					elmA.innerHTML = strTitle;
				}

				/*
				 * Om te zorgen dat de back-knop van de browser teruggaat naar de plek in het document waar op 
				 * de link werd geklikt, wordt deze plek toegevoegd aan de history.
				 * Er geldt één uitzondering: als de link verwijst naar een vorige of volgende paragraaf.
				 */
				if (!((elmA.classList.contains ('navigatie-link'))
					  &&
					  (!strHREF.toLowerCase ().includes ('#h2-inhoud')))) {
					elmA.setAttribute ('onclick', 'location.href=\'#' + strIDVanHuidigeParagraaf + '\';');
				}
			}
			else {
				console.log ('In dit document komt geen anker met #' + strID + ' voor. Controleer deze link');
				elmA.innerHTML = 'onbekende link';
				elmA.style.color = 'red';
			}
		}

		/*
		 * Een externe link wordt geopend in een nieuw tabblad.
		 */
		else {
			elmA.setAttribute ('target', '_blank');
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Deze function wordt aangeroepen als de pagina is geladen en wordt gebruikt om
 * de wrapper open en dicht te klappen, als op de link 'inline' wordt geklikt.
 */
function toonInlineContent (strElementID) {

	var strType = getTypeBasedOnElementID (strElementID);

	// Als de padding onderaan de content moet worden aangepast (omdat er anders een grote ruimte
	// onder de content ontstaat), wordt deze variabele true.
	var blnPaddingBottomMustBeToggled = (strType == ANSWER);

	// De variabele divElement bevat de content die (on-)zichtbaar gemaakt moet worden.
	var divElement = document.getElementById (strElementID + '-toggable-content');

    /*
     * Afhankelijk van de zichtbaarheid van de content wordt die zichtbaar of onzichtbaar gemaakt.
     */
	if (divElement.style.display == 'none') {

		divElement.style.display = 'block';

		if (!blnPaddingBottomMustBeToggled) {
			divElement.style.paddingBottom = "25px";
		}
	} 
	else {

		divElement.style.display = 'none';

		if (!blnPaddingBottomMustBeToggled) {
			divElement.style.paddingBottom = "0px";
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/* 
 * Bepaal welke wrapper een id strElementID heeft en ken dit element de correcte class toe
 * (gebaseerd op het type van de wrapper).
 */
function getElementByIdAndAddClasses (strElementID, strType, strAttribute = 'ID') {

	var elmElement;

	switch (strAttribute) {
		default:
			elmElement = document.getElementById (strElementID);
	}

	var strClassName = strType + '-wrapper';

	if (elmElement.classList) {
		elmElement.classList.add (strClassName);
	}
	else {
		elmElement.setAttribute ('class', strClassName);
	}

	return elmElement;
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
		case ANSWER : strIconName = 'Uitwerking'; break;
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

function toonVideoCatalog (elmVideo) {

	elmVideo.classList.add (BLENDED_WRAPPER);
    elmVideo.classList.add (VIDEOLIST + '-wrapper');

	/*
	 * De initiële zichtbaarheid van de inhoudsopgave (toggle is open) wordt
	 * als css-stijl ingesteld op de (on-)zichtbare content.
	 */
	var blnVisibility = ((elmVideo.getAttribute ('visible') == 'true') ? true : false);

	var strElementID = elmVideo.id;
	var strVisibleContent = 'Klik <em><a class="videoLink">hier</a></em> om de lijst met gebruikte video\'s (on-)zichtbaar te maken.';
	var strInvisibleContent = '<table id="tabel-video" class="videolist"><tr><td></td><td></td></tr></table>';
	elmVideo.innerHTML = getToggleWrapper (strElementID, VIDEOLIST, strVisibleContent, strInvisibleContent, blnVisibility);

	var elmToelichting = document.createElement ('p');
	elmToelichting.innerText = 'Hieronder vind je de lijst met video\'s die op deze pagina verder worden toegelicht. ' +
	                           'In deze lijst zijn ze overzichtelijk op een rij gezet.';
	elmVideo.parentNode.insertBefore (elmToelichting, elmVideo);

	return document.getElementById ('tabel-video');
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Met deze methode wordt een URL toegevoegd, waarmee je een document ook in een
 * nieuw tabblad kunt openen. Deze link kan dan onder de blended wrapper worden 
 * toegevoegd.
 */
function addURLForNewTab (strType, strDocumentName, elmElement) {

	var elmURL = document.createElement ('p');
	elmURL.classList.add ('blended-wrapper-url-naar-nieuw-tabblad');
	elmURL.innerHTML = 'Je kunt ' + strType + ' ook in een nieuw tabblad bekijken door op ' +
	                   '<a href="' + strDocumentName + '" target="_blank">deze link</a> ' +
	                   'te klikken.';
	elmElement.parentNode.insertBefore (elmURL, elmElement.nextSibling);
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
	var elmVideo = document.getElementById (VIDEOLIST);

	if (elmVideo) {

		/*
		 * Als de tabel voor de lijst met video's nog niet is toegevoegd, gebeurt dat nu.
		 */
		tblVideo = document.getElementById ('tabel-video');

		if (!tblVideo) {
			tblVideo = toonVideoCatalog (elmVideo);
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

	constructor (domElement, strEmbed, strLink, strType, strTypeDocument = '', strLoadMelding = '') {

		domElement.classList.add (strType + '-wrapper');
		this.domElement = domElement;
		this.strEmbed = strEmbed;
		this.strLink = strLink;
		this.strType = strType;

		if (strTypeDocument) { 
			this.strTypeDocument = strTypeDocument;
		}

		if (strLoadMelding) {
			this.strLoadMelding = strLoadMelding; 
		}

		this.strTitle = this.domElement.getAttribute ('title');
		
		var strVisibility = this.domElement.getAttribute ('visible');
		this.blnVisibility = (strVisibility == 'true' ? true : false);
	}

	/*
	 * Gebaseerd op het type van de wrapper wordt het juiste icoontje getoond.
	 */
	getIconHTML () {

    	var strIconName;

		switch (this.strType) {
			case MEDIASITE: strIconName = 'Play'; break;
			case STREAM: strIconName = 'Play'; break;
			case YOUTUBE: strIconName = 'Play'; break;
			case WOOCLAP: strIconName = 'Proeftoets'; break;
			case ANSWER : strIconName = 'Uitwerking'; break;
			case DOWNLOAD: strIconName = 'Download'; break;
			case INHOUDSOPGAVE: strIconName = 'Content'; break;
			case VIDEOLIST: strIconName = 'Play'; break;
			case POWERPOINT: strIconName = 'PowerPoint'; break;
			case PDF: strIconName = PDF; break;
			default: strIconName = "Onbekend";
		}

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
	 * In de wrapper met strElementID worden de juiste elementen op de juiste plek toegevoegd.
	 */
	addToggleWrapper () {

		var strElementID = this.domElement.id;
		var strContentDiv;

		/*
		 * Een download-wrapper is altijd zichtbaar (en kan dus niet onzichtbaar worden gemaakt). De
		 * andere wrappers zijn wel clickable en voor deze wrappers kan de content (on-)zichtbaar
		 * worden gemaakt.
		 */
		if (this.strType == DOWNLOAD) {
			strContentDiv = '<div>';
		}
		else {
			strContentDiv = '<div onclick="toonInlineContent (\'' + this.domElement.id + '\');" ' + 
			                '     class="toggle-wrapper">';
		}

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
			strContentDiv += '<div id="' + strElementID + '-toggable-content" ' + 
			                 '     class="blended-content" style=' + strStyle + '>' +
	           			     '    ' + this.getInvisibleContent () + 
	       				 	 '</div>';
		}

		this.domElement.innerHTML = strContentDiv;
	}

	/*
	 * Met deze methode wordt een URL toegevoegd, waarmee je een document ook in een
	 * nieuw tabblad kunt openen. Deze link kan dan onder de blended wrapper worden 
	 * toegevoegd.
	 */
	addURLForNewTab () {

		var elmURL = document.createElement ('p');
		elmURL.classList.add ('blended-wrapper-url-naar-nieuw-tabblad');
		elmURL.innerHTML = 'Je kunt ' + this.strType + ' ook in een nieuw tabblad bekijken door op ' +
		                   '<a href="' + this.strLink + '" target="_blank">deze link</a> ' +
		                   'te klikken.';
		this.domElement.parentNode.insertBefore (elmURL, this.domElement.nextSibling);
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
	 * Met deze functie wordt de src van het iframe in elmBlended geactiveerd, zodat
	 * de content van de toggable div wordt geladen.
	 */
	embedContent () {

		var arrIFrameElements = this.domElement.getElementsByTagName ('iframe');

		if (arrIFrameElements.length > 0) {

			var domIFrame = arrIFrameElements [0];
			domIFrame.setAttribute ('src', this.strLink);

			// Test van deze functionaliteit
			if (EXECUTE_TEST) {
				console.log ('Test van Blended.embedContent: Source van ' + this.domElement.id + ' is ' + domIFrame.getAttribute ('src'));
			}
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

class PowerPoint extends Blended {

	constructor (domPowerPoint) {

		var strPPTXID = domPowerPoint.getAttribute ('pptx-id');
		var strAccount = domPowerPoint.getAttribute ('account');
		var strSite = domPowerPoint.getAttribute ('site');
		var strEmbed;
		var strLink;

		if (strAccount) {
			strEmbed = replacePlaceholderInTekst (ONEDRIVE_BASE_EMBED, '%account', strAccount);
			strLink = replacePlaceholderInTekst (ONEDRIVE_BASE_URL, '%account', strAccount);
		}
		else {
			strEmbed = replacePlaceholderInTekst (TEAMS_OF_SP_BASE_EMBED, '%site', strSite);
			strLink = replacePlaceholderInTekst (TEAMS_OF_SP_BASE_URL, '%site', strSite);
		}

		strEmbed = replacePlaceholderInTekst (strEmbed, '%id', strPPTXID);
		strLink = replacePlaceholderInTekst (strLink, '%id', strPPTXID);

		super (domPowerPoint, strEmbed, strLink, POWERPOINT, 'de presentatie', 'Presentatie wordt geladen...');
	}

	embedContent () {

		var arrToggableElements = this.domElement.getElementsByClassName ('toggable-content');

		if (arrToggableElements.length > 0) {

			var domToggableElement = arrToggableElements [0];
			var strIFrame = '<iframe src="' + this.strEmbed + '" frameborder="0"></iframe>'
			domToggableElement.innerHTML = strIFrame;

			// Test van deze functionaliteit
			if (EXECUTE_TEST) {
				console.log ('Test van PowerPoint.embedContent: Source van ' + this.domElement.id + ' is ' + domToggableElement.innerHTML);
			}
		}
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
		this.domElement.parentNode.insertBefore (domTitel, this.domElement);

		var domToelichting = document.createElement ('p');
		domToelichting.innerHTML = 'Alle Code Smells (met bijbehorende strategieën) zijn overzichtelijk in een Cheat Sheet bij elkaar gebracht. ' +
		    	                   'Hierin staat alle bekende informatie over Code Smells overzichtelijk op een rij. Deze Cheat Sheet wordt elke ' +
		              			   'keer bijgewerkt met de informatie die jullie op dat moment leren. Je vindt hier dus een levend document dat ' +
		                     	   'groeit en uiteindelijk alle informatie bevat over de Code Smells die je moet kennen.';
		this.domElement.parentNode.insertBefore (domToelichting, domTitel.nextSibling);
	}

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

		super (domPDFDocument, strEmbed, strLink, PDF, 'het PDF-document', 'PDF-document wordt geladen...');

		if (strLink.includes (strDocument)) {
			this.updatePDFAsCodeSmellsCheatSheet ();
		}
	}

	/*
	 * KAN WAARSCHIJNLIJK WORDEN OPGERUIMD.
	 * Met deze functie worden alle pdf-viewers aangemaakt die met de tag pdf-viewer
	 * zijn gemarkeerd.
	 *
	 * Deze code heb ik op 30 november 2022 overgenomen van https://codepen.io/mrapol/pen/ObbOdQ
	 * en daarna aangepast.
	 */
	createPDFViewers () {

		var arrPDFViewers = document.getElementsByTagName ('pdf-viewer');

		while (arrPDFViewers.length > 0) {

			var elmPDFViewer = arrPDFViewers [0];
			var strDocumentName = elmPDFViewer.getAttribute ('pdf');
			var strPDFRoot = elmPDFViewer.getAttribute ('pdf-root');

			if (strPDFRoot == 'relative') {
				strDocumentName = strRootDir + ((strDocumentName.substr (0, 1) != '/' ) ? '/' : '') + strDocumentName;
			}

			var divWrapper = document.createElement ('div');
			divWrapper.classList.add ('pdf-viewer');
			divWrapper.classList.add ('set-pdf-viewer-margin');
			divWrapper.classList.add ('set-pdf-viewer-center-block-horiz');
			divWrapper.innerHTML =
				'<div class="responsive-pdf-wrapper responsive-pdf-wrapper-wxh-572x612" style="-webkit-overflow-scrolling: touch; overflow: auto;">' +
				'	<iframe src="' + strDocumentName + '">' +
				'		<p style="font-size: 110%;">' + 
				'			<em><strong style="color: red;">ERROR:</strong> An &#105;frame should be displayed here but your browser version does not support ' +
				'           &#105;frames. </em>Please update your browser to its most recent version and try again.' +
				'		</p>' +
				'	</iframe>' +
				'</div>';

			elmPDFViewer.parentNode.replaceChild (divWrapper, elmPDFViewer);

			addURLForNewTab ('Dit PDF-document', strDocumentName, divWrapper);
		}
	}

	createElement () {

		super.createElement ();

		var domPDF = this.domElement.getElementsByClassName ('toggable-content') [0];

		var domWrapper = domPDF.parentNode;
		domWrapper.classList.add ('pdf-viewer');
		domWrapper.classList.add ('set-pdf-viewer-margin');
		domWrapper.classList.add ('set-pdf-viewer-center-block-horiz');

		domPDF.classList.add ('responsive-pdf-wrapper');
		domPDF.classList.add ('responsive-pdf-wrapper-wxh-572x612');
		domPDF.style.cssText = '-webkit-overflow-scrolling: touch; overflow: auto;';
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van een HTML-id, een video-id, een paragraaf, een titel en de initiële zichtbaarheid
 * wordt een video-wrapper (voor MediaSite, MS Stream of YouTube) gevuld met de juiste content.
 */
function addVideoContent (strType, strElementID, strVideoID, strParagraph, strTitle, blnVisibility) {


	var strBaseURL;

	switch (strType) {
		case MEDIASITE: 
			strBaseURL = MEDIASITE_BASE_URL; 
			break;
		case STREAM: 
			strBaseURL = STREAM_BASE_URL; 
			break;
		case YOUTUBE: 
			strBaseURL = YOUTUBE_BASE_URL;
			break;
	}

	/*
	 * Als je een actieve link op wilt nemen in het zichtbare gedeelte van de toggle-wrapper, dan voeg je de volgende String toe aan strVisibleContent:
	 *
	 *     '<a href="' + strLink + '" onclick="toonInlineContent (\'' + strElementID + '\');" ' +
	 *	   '   target="_blank" class="videoLink">fullscreen</a>'
	 *
	 */
	var divVideo = getElementByIdAndAddClasses (strElementID, strType);

	if (strType != YOUTUBE) {
		strVideoID = addSlashIfNeeded (strVideoID);
	}

	var strLink = strBaseURL + strVideoID;
	var strVisibleContent   = 'Maak de video <em><a class="videoLink">hier</a></em> (on-)zichtbaar - ' + strTitle;
	var strInvisibleContent = '	   <div class="' + strType + '-toggable-content">' + 
							  '        <div class="loading">Video wordt geladen...</div>' + 
		                      '        <iframe class="' + strType + '-iframe"' +
		                      '			       frameborder="0" scrolling="auto" marginheight="0" marginwidth="0"' + 
		                      '                allow="fullscreen" data-mce-fragment="1">' + 
		                      '        </iframe>' +
		                      '    </div>';
		
	divVideo.innerHTML = getToggleWrapper (strElementID, strType, strVisibleContent, strInvisibleContent, blnVisibility);
	addURLForNewTab ('deze video', strLink, divVideo);

    /*
     * Alle Mediasite-, MS Stream- en YouTube-video's worden in een lijst (bijv. bovenaan de pagina) verzameld en getoond.
     */
	addVideoContentToList (strVideoID, strParagraph, strTitle, strType);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van een id, een wooclap-dir en een type (proeftoets of vraag) wordt een 
 * wooclap-wrapper gevuld met de juiste content.
 */
function addWooclapContent (strElementID, strWooclapDir, strType, blnVisibility) {

	var divWooclap = getElementByIdAndAddClasses (strElementID, WOOCLAP);
	var strURL;
	var strTypeWooclap;
	var strAccountType;

	if (strType.toLowerCase () == "wooflash") {
		strURL = WOOFLASH_BASE_EMBED + addSlashIfNeeded (strWooclapDir);
		divWooclap.classList.add ('wooflash-wrapper');
	}
	else {
		strURL = WOOCLAP_BASE_EMBED + addSlashIfNeeded (strWooclapDir);
	}

	var strHref = '<a href="' + strURL + '"' + 
                  '   onclick="toonInlineContent (\'' + strElementID + '\');" ' +
				  '   class="videoLink" target="_blank" rel="noreferrer noopener">' +
	              '    <em>full screen</em>' +
	              '</a>'; 
	var strVisibleContent = '<p class="wooclap-p">';

	if (strType.toLowerCase () == 'wooflash') {
		strAccountType = 'Het nadeel van Wooflash is wel dat je hiervoor alleen in kunt loggen met een account dat je aanmaakt bij Wooflash en dat je dit ' +
		                 'account dus niet kunt gebruiken voor bijv. Wooclap.';
	}
	else {

		if (strType.toLowerCase	() == 'proeftoets') {
			strTypeWooclap = 'Wooclap-' + strType.toLowerCase ();
		}
		else {
			strTypeWooclap = 'Wooclap-vragenlijst';
		}

		strAccountType = 'Voor Wooclap log je in met je student-account. Je hoeft dus niet opnieuw in te loggen als je deze ' + strTypeWooclap + ' wilt ' +
		                 'doorlopen.'
	}

	/*
	 * Bij verschillende types (vragenlijst of proeftoets) worden verschillende clickable teksten getoond.
	 */
	if (strType.toLowerCase	() == 'vraag') {
		strVisibleContent = 'Zou je nu nog een paar vragen willen beantwoorden? Ik gebruik jullie antwoorden bij de voorbereiding van het hoorcollege.';
	}
	else if (strType.toLowerCase () == 'proeftoets') {
		strVisibleContent = 'Tijdens het hoorcollege liepen we samen door een proeftoets heen die ' +
			  				'helpt om inzicht te krijgen in je begrip van de behandelde stof. Na ' +
							'afloop van het hoorcollege kun je deze proeftoets opnieuw doorlopen.';
	}
	else if (strType.toLowerCase () == 'wooflash') {
		strVisibleContent = 'Het is ook mogelijk om deze zelfde proeftoets op Wooflash te maken. Het voordeel van Wooflash ' +
							'is dat je deze proeftoets dan meerdere keren opnieuw kunt doorlopen. Je kunt dan ook zien in hoeverre ' +
							'je op basis van cognitieve theorieën (die gebaseerd zijn op hersenonderzoek) wat betreft het ' +
							'onderwerp van deze proeftoets klaar bent voor de echte toets! Het nadeel is helaas wel dat je ' +
							'daarvoor een eigen - nieuw - account aan moet maken voor Wooflash.';
		strTypeWooclap = 'Wooflash-proeftoets';
	}

	strVisibleContent  += '<br><br>Maak deze ' + strTypeWooclap + ' <a class="videoLink"><em>hier</em></a> (on-)zichtbaar.</p>';

	var strInvisibleContent	= '<div class="loading">Quiz wordt geladen...</div>' + 
							  '<iframe width="100%" height="800" allowfullscreen="allowfullscreen" frameborder="0"' +
						      '        mozallowfullscreen="mozallowfullscreen".' + // onload="removeLoading (this);">' +
						      '</iframe>';

	divWooclap.innerHTML = getToggleWrapper	(strElementID, WOOCLAP, strVisibleContent, strInvisibleContent, blnVisibility);
	addURLForNewTab ('deze Wooclap- of Wooflash-vragenlijst', strURL, divWooclap);

}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van een paragraafnummer wordt de uitwerking voor een opdracht opgemaakt.
 */
function makeAnswerToggable (strElementID, strParagraph, blnVisibility) {

	var divAnswer = getElementByIdAndAddClasses (strElementID, ANSWER);

    var strDeeltitel        = replacePlaceholdersInTitle ('%t %p', '', strParagraph);
	var strVisibleContent   = 'Klik <em><a class="videoLink">hier</a></em> om de uitwerking van ' +
		                      strDeeltitel + ' (on-)zichtbaar te maken.';
    var strInvisibleContent	= divAnswer.innerHTML;
		
	divAnswer.innerHTML = getToggleWrapper (strElementID, ANSWER, strVisibleContent, strInvisibleContent, blnVisibility);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van de relativity van de link (relative of absolute), de download-link en
 * de title wordt de download-wrapper gevuld met de juiste content.
 */
function createDownloadContainer (strElementID, blnIsRelativeLink, strURL, strTitle) {

	var divDownload = getElementByIdAndAddClasses (strElementID, DOWNLOAD);

	if (blnIsRelativeLink) {

		if (strURL.substr (0, 1) != '/') {
			strURL = "/" + strURL;
		}

		strURL = strRootDir + strURL;
	}

	strVisibleContent = 'Download <em><a href="' + strURL + '" class="videoLink">' + strTitle + '</a></em>';
	divDownload.innerHTML = getToggleWrapper (strElementID, DOWNLOAD, strVisibleContent, "");
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Deze functie toggle-t tussen 'één tegelijk' en 'meer tegelijk'.
 * Als geen parameter wordt meegegeven wordt de waarde omgedraaid (true wordt false en andersom).
 * Als deze functie voor een element voor het eerst wordt aangeroepen, wordt de array met Laatst
 * geselecteerde vragen aangevuld met een element zonder laatst geselecteerde vragen (een lege
 * array).
 */
var blnFAQEenTegelijk = true;
var objGeselecteerdeVragen = {};

/*
 * Als er maar één vraag tegelijkertijd open mag staan, dan wordt de lijst
 * met vragen aangemaakt met alleen de vraag als element.
 * 
 * Als de vraag nog niet voorkomt in de lijst met geselecteerde vragen, dan 
 * wordt de vraag toegevoegd aan het einde van die lijst.
 * 
 * Als de vraag wel voorkomt, wordt de vraag naar het einde van de lijst verplaatst.
 */
function voegVraagToeAanGeselecteerdeVragen (strElementID, elmVraag) {

	if (blnFAQEenTegelijk) {
		objGeselecteerdeVragen [strElementID] = [elmVraag];
	}
	else {

		var arrGeselecteerdeVragenInVolgorde = objGeselecteerdeVragen [strElementID];
		var intIndexVanVraag = arrGeselecteerdeVragenInVolgorde.indexOf (elmVraag);

		if (intIndexVanVraag != -1) {
			arrGeselecteerdeVragenInVolgorde.push (arrGeselecteerdeVragenInVolgorde.splice (intIndexVanVraag, 1) [0]);
		}
		else {
			arrGeselecteerdeVragenInVolgorde.push (elmVraag);
		}
	}
}

/*
 * Als elmVraag nog niet actief is, wordt de vraag actief gemaakt en wordt de vraag toegevoegd aan
 * of verplaatst naar het einde van de lijst met geselecteerde vragen.
 */
function activeerVraag (strElementID, elmVraag) {
	elmVraag.classList.add ('faq-active');
	elmVraag.nextElementSibling.style.display = 'block';
	elmVraag.nextElementSibling.nextElementSibling.style.display = 'block';
	voegVraagToeAanGeselecteerdeVragen (strElementID, elmVraag);
}

function deactiveerVraag (strElementID, elmVraag) {

	/*
	 * Verander de vraag van actief naar inactief en maak de gekoppelde scheidingslijn
	 * en het antwoord onzichtbaar.
	 * 
	 * Verwijder de vraag vervolgens uit de lijst met geselecteerde vragen voor het 
	 * element-id.
	 */
	elmVraag.classList.remove ('faq-active');
	elmVraag.nextElementSibling.style.display = 'none';
	elmVraag.nextElementSibling.nextElementSibling.style.display = 'none';

	var arrGeselecteerdeVragenInVolgorde = objGeselecteerdeVragen [strElementID];
	var intIndexVanVraag = arrGeselecteerdeVragenInVolgorde.indexOf (elmVraag);

	if (intIndexVanVraag != -1) {
		arrGeselecteerdeVragenInVolgorde.splice (intIndexVanVraag, 1);
	}
}

/*
 * Toggle vraag qua zichtbaarheid.
 */
function toggleVraag (strElementID, elmVraag) {

	if (elmVraag.classList.contains ('faq-active')) {
		deactiveerVraag (strElementID, elmVraag);
	}
	else {
		activeerVraag (strElementID, elmVraag);
	}
}

function toonJuisteTekstEnCheckbox (strElementID) {

	var strTekst = 'meer vragen tegelijk open';
	var strImage = 'Unchecked';

	if (blnFAQEenTegelijk) {
		 strTekst = 'één vraag tegelijk open';
		 strImage = 'Checked';
	}

	elmFAQSetup = document.getElementById (strElementID).getElementsByClassName ('faq-setup') [0];
	elmFAQSetup.getElementsByClassName ('faq-setup-tekst') [0].innerText = strTekst;

	var elmCheckbox = elmFAQSetup.getElementsByClassName ('faq-setup-checkbox') [0];
	var elmImage = elmCheckbox.getElementsByTagName ('img') [0];
	elmImage.src = '';
	elmImage.src = strRootDir + '/media/Algemeen - ' + strImage + '.gif';
}

function toggleFAQSetup () {

	blnFAQEenTegelijk = !blnFAQEenTegelijk;

	for (elmFAQSetup of document.getElementsByClassName ('faq-setup')) {
		toonJuisteTekstEnCheckbox (elmFAQSetup.parentNode.id);
	}

	/*
	 * Als er maar één vraag zichtbaar mag zijn, wordt de laatst geselecteerde vraag (als die er is) 
	 * in alle FAQ's zichtbaar gemaakt.
	 */
	if (blnFAQEenTegelijk) {

		for (const [key, value] of Object.entries (objGeselecteerdeVragen)) {

			var arrLaatstGeselecteerdeVragen = value;

			if (arrLaatstGeselecteerdeVragen.length > 0) {
				var elmLaatstGeselecteerdeVraag = arrLaatstGeselecteerdeVragen [arrLaatstGeselecteerdeVragen.length - 1];
				minifyFAQ (key);
				activeerVraag (key, elmLaatstGeselecteerdeVraag);
			}
		}
	}
}

function expandOrMinifyFAQ (strElementID, strFAQAction) {

	for (elmVraag of document.getElementById (strElementID).querySelectorAll ('.faq-vraag')) {
		
		var blnIsActive = elmVraag.classList.contains ('faq-active');
		var blnMustBeExpanded = (strFAQAction == FAQActions.expand);
		var blnMustBeMinified = (strFAQAction == FAQActions.minify);

		if ((blnMustBeExpanded && !blnIsActive)
		    ||
			(blnMustBeMinified && blnIsActive)) {
			elmVraag.click ();
		}
	}	
}

function expandFAQ (strElementID) {

	var elmGeselecteerdeVraag = null;

	if (blnFAQEenTegelijk) {

		if (objGeselecteerdeVragen [strElementID].length == 1) {
			elmGeselecteerdeVraag = objGeselecteerdeVragen [strElementID] [0];
		}

		toggleFAQSetup ();
	}

	expandOrMinifyFAQ (strElementID, FAQActions.expand);

	if (elmGeselecteerdeVraag) {
		voegVraagToeAanGeselecteerdeVragen (strElementID, elmGeselecteerdeVraag);
	}
}

function minifyFAQ (strElementID) {
	expandOrMinifyFAQ (strElementID, FAQActions.minify);
}

/*
 * Met deze functie wordt het selecteren van een vraag verwerkt.
 */
function eventHandlerVoorVraagSelectie (strElementID, elmGeselecteerdeVraag, strActie = FAQActions.select) {

    for (var elmVraag of document.getElementById (strElementID).querySelectorAll ('.faq-vraag')) {

        if (elmVraag != elmGeselecteerdeVraag) {

			if (blnFAQEenTegelijk) {
				deactiveerVraag (strElementID, elmVraag);
			}
			else {

				switch (strActie) {
					case FAQActions.minify: deactiveerVraag (strElementID, elmVraag); break;
					case FAQActions.expand: activeerVraag (strElementID, elmVraag); break;
					default: // Default moeten de andere vragen niet veranderen.
				}
			}
        }
    }

	/* 
	 * Zorg dat 'faq-vraag' de class 'faq-active' krijgt en dat de daarop volgende
	 * hr en 'faq-antwoord' zichtbaar worden gemaakt.
	 */
    if (elmGeselecteerdeVraag) {
		toggleVraag (strElementID, elmGeselecteerdeVraag);
	}
}

/*
 * Op basis van de relativity van de link (relative of absolute), de download-link en
 * de title wordt de download-wrapper gevuld met de juiste content.
 *
 * Creatief gekopieerd vanaf https://sweetcode.io/how-to-build-an-faq-page-with-html-and-javascript/.
 */
function createFAQ (strElementID, strWerkvorm, strNiveau, strTitle) {

	var elmFAQ = getElementByIdAndAddClasses (strElementID, FAQ);

	var elmToelichting = document.createElement ('p');
	elmToelichting.innerHTML = 'Tijdens ' + strWerkvorm + ' kwamen een aantal veel voorkomende vragen aan de orde. ' + 
	                           'Die worden hieronder beantwoord.';
	elmToelichting.style.cssText += "margin-bottom: 0px;";
	elmFAQ.parentNode.insertBefore (elmToelichting, elmFAQ);

	var elmSetup = document.createElement ('div');
	elmSetup.id = strElementID + '-faq-setup';
	elmSetup.className = 'faq-setup';
	elmSetup.innerHTML = '<div class="faq-setup-tekst"></div>' + 
						 '<div class="faq-setup-checkbox"><img></div>' +
						 '<div class="faq-setup-expand" onclick="expandFAQ (\'' + strElementID + '\');"></div>' +
						 '<div class="faq-setup-minify" onclick="minifyFAQ (\'' + strElementID + '\');"></div>';

	var elmImage = elmSetup.getElementsByTagName ('img') [0];

    elmImage.addEventListener ('click', function ()  {
    	toggleFAQSetup (!blnFAQEenTegelijk);
    });

	elmFAQ.insertBefore (elmSetup, elmFAQ.firstChild);

	for (var liVraag of elmFAQ.children) {

		if (!liVraag.classList.contains ('faq-setup')) {

			liVraag.classList.add ('faq-element');

			var arrVraagEnAntwoord = liVraag.children;

			var elmVraag = arrVraagEnAntwoord [0];
			elmVraag.classList.add ('faq-vraag');

			var hr = document.createElement ('hr');
			elmVraag.parentNode.insertBefore (hr, elmVraag.nextSibling);

			var elmAntwoord = arrVraagEnAntwoord [2];
			elmAntwoord.classList.add ('faq-antwoord');
		}
	}	

	for (var elmVraag of elmFAQ.getElementsByClassName ("faq-vraag")) {

    	elmVraag.addEventListener ('click', function ()  {
    		eventHandlerVoorVraagSelectie (strElementID, this);
    	});
	}

	// Zorg dat een lege lijst met geselecteerde vragen wordt toegevoegd voor element met strElementID.
	toonJuisteTekstEnCheckbox (strElementID);
	objGeselecteerdeVragen [strElementID] = [];
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Met deze functie wordt een tag- of attributename toegevoegd aan de lijst met
 * al toegevoegde names.
 */

function addNameToKommaSeparatedString (strName, strNames) {

	if (strNames.length > 0) {
		strNames += ',';
	}

	return strNames + strName;
}

/*
 * Met deze functie wordt de src van het iframe in elmBlended geactiveerd, zodat
 * de content van de toggable div wordt geladen.
 */
function addSourceToIFrame (elmBlended, strSource) {

	var arrIFrameElements = elmBlended.getElementsByTagName ('iframe');

	if (arrIFrameElements.length > 0) {
		var elmIFrame = arrIFrameElements [0];
		elmIFrame.setAttribute ('src', strSource);

		// Test van deze functionaliteit
		if (EXECUTE_TEST) {
			console.log ('Test van addSourceToIFrame: Source van ' + elmBlended.id + ' is ' + elmIFrame.getAttribute ('src'));
		}
	}
}

/*
 * Met deze functie wordt het iframe voor de powerpoint vervangen door een nieuw iframe, omdat CORS
 * verhindert dat de PPTX met de toevoeging van een src aan het iframe wordt uitgevoerd.
 */
function replaceIFrame (elmBlended, strSource) {

	var arrToggableElements = elmBlended.getElementsByClassName ('toggable-content');

	if (arrToggableElements.length > 0) {

		var elmToggableElement = arrToggableElements [0];
		var strIFrame = '<iframe src="' + strSource + '" frameborder="0"></iframe>'
		elmToggableElement.innerHTML = strIFrame;

		// Test van deze functionaliteit
		if (EXECUTE_TEST) {
			console.log ('Test van replaceIFrame: Source van ' + elmBlended.id + ' is ' + elmToggableElement.innerHTML);
		}
	}
}

/*
 * Met deze functie worden de sources lazy loaded toegevoegd aan de elmenten voor
 * Wooclap, Video en PowerPoint.
 */
function addSourceToBlendedElements () {

	arrContent.forEach (objBlended => {
		objBlended.embedContent ();
	});

	strNames = '';
	strNames = addNameToKommaSeparatedString (MEDIASITE, strNames);
	strNames = addNameToKommaSeparatedString (STREAM, strNames);
	strNames = addNameToKommaSeparatedString (YOUTUBE, strNames);

	for (var elmBlended of getElementsByNames (strNames)) {

		var strMediasiteID = elmBlended.getAttribute (MEDIASITE + '-id');
		var strStreamID = elmBlended.getAttribute (STREAM + '-id');
		var strYouTubeID = elmBlended.getAttribute (YOUTUBE + '-id');
		var strSource;

		if (strMediasiteID) {
			strSource = MEDIASITE_BASE_EMBED + addSlashIfNeeded (strMediasiteID);
		}
		else if (strStreamID) {
			strSource = STREAM_BASE_EMBED + addSlashIfNeeded (strStreamID);
		}
		else if (strYouTubeID) {
			strSource = YOUTUBE_BASE_EMBED + addSlashIfNeeded (strYouTubeID);
		}

		addSourceToIFrame (elmBlended, strSource);
	}

	for (var elmBlended of getElementsByNames (WOOCLAP)) {

		var strWooclapDir = elmBlended.getAttribute (WOOCLAP + '-dir');
		var strSource;

		if (elmBlended.getAttribute ('type').toLowerCase () == WOOFLASH) {
			strSource = WOOFLASH_BASE_EMBED + addSlashIfNeeded (strWooclapDir);
		}
		else {
			strSource = WOOCLAP_BASE_EMBED + addSlashIfNeeded (strWooclapDir);
		}

		addSourceToIFrame (elmBlended, strSource);
	}

	/*
	for (var elmBlended of getElementsByNames (POWERPOINT)) {

		var strPPTXID = elmBlended.getAttribute (POWERPOINT + '-id');
		var strAccount = elmBlended.getAttribute ('account');
		var strSource;
		
		if (strAccount) {
			strSource = replacePlaceholderInTekst (ONEDRIVE_BASE_EMBED, '%account', strAccount);
		}
		else {
			strSource = replacePlaceholderInTekst (TEAMS_OF_SP_BASE_EMBED, '%site', elmBlended.getAttribute ('site'));
		}

		replaceIFrame (elmBlended, replacePlaceholderInTekst (strSource, '%id', strPPTXID));
	}
	*/
}

// /////////////////////////////////////////////////////////////////////////// //
// Hieronder wordt de functionaliteit van de setup van de FAQ getest.          //
// /////////////////////////////////////////////////////////////////////////// //
function testClickEenTegelijk (elmFAQ) {
	elmFAQ.querySelector ('.faq-setup-checkbox img').click ();
}

function testClickExpand (elmFAQ) {
	elmFAQ.querySelector ('.faq-setup-expand').click ();
}

function testClickMinify (elmFAQ) {
	elmFAQ.querySelector ('.faq-setup-minify').click ();
}

function testClickFAQ (elmFAQ, intElementIndex) {
	elmFAQ.querySelectorAll ('.faq-element') [intElementIndex].getElementsByTagName ('div') [0].click ();
}

function testGetEenTegelijk (blnTegelijk) {
	return blnTegelijk ? 'Eén tegelijk' : 'Meer tegelijk';
}

function testGetCSS (blnGeslaagd) {

	if (blnGeslaagd) {
		return 'color: green;';
	}
	else {
		return 'background-color: yellow; color: red;';
	}
}

function testGetArray (arrArray) {

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

function testGetExpectedTekst (strExpected) {
	return ' (expected: ' + strExpected + ')';
}

function testToonEenTegelijk (bln_expFAQEenTegelijk) {

	var strCSS;
	var strExpected;

	if (bln_expFAQEenTegelijk == blnFAQEenTegelijk) {
		strCSS = testGetCSS (true);
		strExpected = '';
	}
	else {
		strCSS = testGetCSS (false);
		strExpected = testGetExpectedTekst (strExpected);
	}

	console.log ('= Actual: %cInstelling één tegelijk: ' + testGetEenTegelijk (blnFAQEenTegelijk) + strExpected, strCSS);
}

function testToonVolgorde (elmFAQ, strExpected) {

	var arrActual = [];

	for (const elmVraag of objGeselecteerdeVragen [elmFAQ.id]) {
		arrActual.push (Array.prototype.indexOf.call (elmFAQ.querySelectorAll ('.faq-vraag'), elmVraag) + 1);
	}

	var strActual = testGetArray (arrActual);
	var strCSS;

	if (strActual == strExpected) {
		strCSS = testGetCSS (true);
		strExpected = '';
	}
	else {
		strCSS = testGetCSS (false);
		strExpected = testGetExpectedTekst (strExpected);
	}

	console.log ('=         %cLaatst geselecteerde vragen: ' + strActual + strExpected, strCSS);
}

function testToonZichtbaar (elmFAQ, strExpected) {

	var arrActual = [];
	var intTeller = 1;

	for (elmVraag of elmFAQ.querySelectorAll ('.faq-vraag')) {

		if (elmVraag.classList.contains ('faq-active')) {
			arrActual.push (intTeller);
		}

		intTeller++;
	}

	var strActual = testGetArray (arrActual);
	var strCSS;

	if (strActual == strExpected) {
		strCSS = testGetCSS (true);
		strExpected = '';
	}
	else {
		strCSS = testGetCSS (false);
		strExpected = testGetExpectedTekst (strExpected);
	}

	console.log ('=         %cGeselecteerde vragen: ' + strActual + strExpected, strCSS);
}

function testToonResultaat (intTestnummer, strActie, elmFAQ, bln_expFAQEenTegelijk, arr_expGeselecteerdeVragenInVolgorde, arr_expZichtbaarGeselecteerdeVragen) {

	var strTestnummer = ((intTestnummer < 10) ? '00' : ((intTestnummer < 100) ? '0' : '')) + intTestnummer;
	var str_expVolgorde = testGetArray (arr_expGeselecteerdeVragenInVolgorde);
	var str_expZichtbaar = testGetArray (arr_expZichtbaarGeselecteerdeVragen);

	console.log ('');
	console.log ('= Testcasus FAQ ' + strTestnummer + ' ==============================================================');
	console.log ('= Actie:  ' + strActie + '.');
	testToonEenTegelijk (bln_expFAQEenTegelijk);
	testToonVolgorde (elmFAQ, str_expVolgorde);
	testToonZichtbaar (elmFAQ, str_expZichtbaar);
	console.log ('= Einde Testcasus ================================================================');
}

function testFAQSetup () {

	var strElementID = 'test-faq-setup';
	var elmFAQ = document.createElement ('div');
	elmFAQ.id = strElementID;
	elmFAQ.setAttribute ('header', '2');
	elmFAQ.setAttribute ('werkvorm', 'test van de FAQ');
	elmFAQ.title = 'Test van de FAQ Setup';

	/*
	 * Voeg een testbare FAQ toe aan de pagina die aan het einde van de test wordt verwijderd.
	 */
	for (var i = 0; i < 3; i++) {
		var elmFAQElement = document.createElement ('div');

		var elmVraag = document.createElement ('div');
		elmVraag.innerText = 'Vraag ' + (i + 1);
		elmFAQElement.appendChild (elmVraag);

		var elmAntwoord = document.createElement ('div');
		elmAntwoord.innerHTML = 'Antwoord ' + (i + 1);
		elmFAQElement.appendChild (elmAntwoord);

		elmFAQ.appendChild (elmFAQElement);
	}

	document.getElementsByTagName ('body') [0].appendChild (elmFAQ);
	createFAQ (strElementID, 'test van de FAQ', '2', 'test van de FAQ');

	testToonResultaat (1, 'Element geïnitialiseerd', elmFAQ, true, [], []);
	testClickFAQ (elmFAQ, 0);
	testToonResultaat (2, 'Eerste element geselecteerd', elmFAQ, true, [1], [1]);
	testClickFAQ (elmFAQ, 2);
	testToonResultaat (3, 'Derde element geselecteerd', elmFAQ, true, [3], [3]);
	testClickEenTegelijk (elmFAQ);
	testToonResultaat (4, 'Checkbox naar "meer tegelijk"', elmFAQ, false, [3], [3]);
	testClickFAQ (elmFAQ, 0);
	testToonResultaat (5, 'Eerste element geselecteerd', elmFAQ, false, [3, 1], [1, 3]);
	testClickEenTegelijk (elmFAQ);
	testToonResultaat (6, 'Checkbox naar "één tegelijk"', elmFAQ, true, [1], [1]);
	testClickExpand	(elmFAQ);
	testToonResultaat (7, 'Expand-all geselecteerd', elmFAQ, false, [2, 3, 1], [1, 2, 3]);
	testClickEenTegelijk (elmFAQ);
	testToonResultaat (8, 'Check naar "één tegelijk"', elmFAQ, true, [1], [1]);
	testClickFAQ (elmFAQ, 0);
	testToonResultaat (9, 'Eerste element gedeactiveerd', elmFAQ, true, [], []);
	testClickFAQ (elmFAQ, 0);
	testToonResultaat (10, 'Eerste element geselecteerd', elmFAQ, true, [1], [1]);
	testClickFAQ (elmFAQ, 1);
	testToonResultaat (11, 'Tweede element geselecteerd', elmFAQ, true, [2], [2]);
	testClickExpand	(elmFAQ);
	testToonResultaat (12, 'Expand-all geselecteerd', elmFAQ, false, [1, 3, 2], [1, 2, 3]);
	testClickFAQ (elmFAQ, 1);
	testToonResultaat (13, 'Tweede element gedeactiveerd', elmFAQ, false, [1, 3], [1, 3]);
	testClickFAQ (elmFAQ, 1);
	testToonResultaat (14, 'Tweede element geselecteerd', elmFAQ, false, [1, 3, 2], [1, 2, 3]);
	testClickMinify (elmFAQ);
	testToonResultaat (15, 'Minify-all geselecteerd', elmFAQ, false, [], []);
	testClickEenTegelijk (elmFAQ);
	testToonResultaat (16, 'Checkbox naar "één tegelijk"', elmFAQ, true, [], []);
	testClickFAQ (elmFAQ, 0);
	testToonResultaat (17, 'Eerste element geselecteerd', elmFAQ, true, [1], [1]);
	testClickFAQ (elmFAQ, 2);
	testToonResultaat (18, 'Derde element geselecteerd', elmFAQ, true, [3], [3]);
	testClickMinify (elmFAQ);
	testToonResultaat (19, 'Minify-all geselecteerd', elmFAQ, true, [], []);
	testClickFAQ (elmFAQ, 2);
	testToonResultaat (20, 'Tweede element geselecteerd', elmFAQ, true, [3], [3]);
	testClickExpand	(elmFAQ);
	testToonResultaat (21, 'Expand-all geselecteerd', elmFAQ, false, [1, 2, 3], [1, 2, 3]);
	testClickMinify (elmFAQ);
	testToonResultaat (22, 'Minify-all geselecteerd', elmFAQ, false, [], []);
	testClickExpand	(elmFAQ);
	testToonResultaat (23, 'Expand-all geselecteerd', elmFAQ, false, [1, 2, 3], [1, 2, 3]);

	/*
	 * Het element is alleen toegevoegd voor testdoeleinden en kan nu worden verwijderd.
	 */
	document.getElementById (strElementID).previousElementSibling.remove ();
	document.getElementById (strElementID).remove ();
}
