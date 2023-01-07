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
var strCSSFileName = strRootDir + '/resources/brightspace.css';

elmCSS.rel = 'stylesheet';
elmCSS.type = 'text/css';
elmCSS.href = strCSSFileName;
elmCSS.media = 'all';
document.head.appendChild (elmCSS);

elmCSS.addEventListener ("load", () => { logMessage ('css', strCSSFileName, false); });
elmCSS.addEventListener ("error", (ev) => { logMessage ('css', strCSSFileName, true); });

// /////////////////////////////////////////////////////////////////////////// //

const MEDIASITE = 'mediasite';
const STREAM = 'stream';
const YOUTUBE = 'youtube';
const ANSWER = 'answer';
const WOOCLAP = 'wooclap';
const DOWNLOAD = 'download';

// /////////////////////////////////////////////////////////////////////////// //

const MEDIASITE_BASE_URL = "https://hhs.mediamission.nl/Mediasite/Play/";
const STREAM_BASE_URL = "https://web.microsoftstream.com/video/";
const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

// /////////////////////////////////////////////////////////////////////////// //

/* 
 * Deze array wordt gebruikt om alle wrappers in op te slaan (waarin vids, uitwerkingen
 * e.d. worden toegevoegd), zodat ze - als de pagina helemaal geladen is - gevuld
 * kunnen worden met relevante content.
 */
let content = [];

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

/*
 * Als het hele HTML-document geladen is, worden de blended divs gevuld met
 * de juiste content en opgemaakt.
 */
window.onload = function (event) {

	/*
	 * Alle wrappers worden gekenmerkt door de class 'blended-wrapper'.
	 */
	var arrBlendedDivs = document.getElementsByClassName ('blended-wrapper');

    /*
     * Alle wrappers krijgen een id en relevante gegevens worden tijdelijk 
     * opgeslagen in de array content, zodat de wrappers in een volgende loop
     * kunnen worden gevuld met de juiste content.
     */
    for (let i = 0; i < arrBlendedDivs.length; i++) {

    	/*
    	 * Elke wrapper heeft een uniek kenmerk.
    	 */
    	var divBlended = arrBlendedDivs [i];

    	// Van toggable wrappers kan worden ingesteld dat ze bij de start zichtbaar zijn (of niet)
    	var strVisibility = divBlended.getAttribute ('visible');

    	if (strVisibility != "true") {
    		strVisibility = false;
    	}

    	// Alleen video-wrappers voor Mediasite hebben het kenmerk 'mediasite-id'.
    	var strMediasiteID = divBlended.getAttribute (MEDIASITE + '-id');
    	// Alleen video-wrappers voor MS Stream hebben het kenmerk 'stream-id'.
    	var strStreamID = divBlended.getAttribute (STREAM + '-id');
    	// Alleen video-wrappers voor YouTube hebben het kenmerk 'youtube-id'.
    	var strYoutubeID = divBlended.getAttribute (YOUTUBE + '-id');
    	// Alleen wooclap-wrappers hebben het kenmerk 'wooclap-dir'.
    	var strWooclapDir = divBlended.getAttribute (WOOCLAP + '-dir');
    	// Alleen wrappers met de uitwerking van een opdracht hebben geen mediasite-id,
    	// maar wel een paragraph.
    	var strParagraph = divBlended.getAttribute ('paragraph');
    	// Alleen download-wrappers hebben het kenmerk 'download-link'.
    	var strDownloadLink = divBlended.getAttribute (DOWNLOAD + '-link');

        /*
         * Voor een mediasite-wrapper wordt naast paragraaf en mediasite-id ook
         * de title tijdelijk in de array content opgeslagen.
         */
    	if (strMediasiteID) {
    		var strBlendedID = setIDForBlendedElement (MEDIASITE, divBlended, i);
    		var strTitle = divBlended.getAttribute ('title');
    		content.push ([strBlendedID, strMediasiteID, strParagraph, strTitle, strVisibility]);
    	}

        /*
         * Voor een mediasite-wrapper wordt naast paragraaf en mediasite-id ook
         * de title tijdelijk in de array content opgeslagen.
         */
        else if (strStreamID) {
    		var strBlendedID = setIDForBlendedElement (STREAM, divBlended, i);
    		var strTitle = divBlended.getAttribute ('title');
    		content.push ([strBlendedID, strStreamID, strParagraph, strTitle, strVisibility]);
        }

        /*
         * Voor een youtube-wrapper wordt naast paragraaf en youtube-id ook
         * de title tijdelijk in de array content opgeslagen.
         */
        else if (strYoutubeID) {
    		var strBlendedID = setIDForBlendedElement (YOUTUBE, divBlended, i);
    		var strTitle = divBlended.getAttribute ('title');
    		content.push ([strBlendedID, strYoutubeID, strParagraph, strTitle, strVisibility]);
        }

        /*
         * Voor een wooclap-wrapper wordt naast de wooclap-dir ook het type
         * tijdelijk in de array content opgeslagen.
         */
    	else if (strWooclapDir) {
    		var strBlendedID = setIDForBlendedElement (WOOCLAP, divBlended, i);
    		var strType = divBlended.getAttribute ('type');
    		content.push ([strBlendedID, strWooclapDir, strType, strVisibility]);
    	}

    	/*
         * Voor een wrapper met de uitwerking van een opdracht wordt alleen de 
         * paragraaf tijdelijk in de array content opgeslagen.
         */
    	else if (strParagraph) {
    		var strBlendedID = setIDForBlendedElement (ANSWER, divBlended, i);
    		content.push ([strBlendedID, strParagraph, strVisibility]);
    	}

    	/*
         * Voor een download-wrapper worden naast de download-link ook download-root
         * en title tijdelijk in de array content opgeslagen.
         */
    	else if (strDownloadLink) {
    		var strBlendedID = setIDForBlendedElement (DOWNLOAD, divBlended, i);
    		var blnIsRelativeLink = divBlended.getAttribute (DOWNLOAD + '-root') == 'relative' ? true : false;
    		var strTitle = divBlended.getAttribute ('title');
    		content.push ([strBlendedID, blnIsRelativeLink, strDownloadLink, strTitle]);
    	}
	}

    /*
     * Als er wrappers op de pagina staan, worden die nu gevuld met de content.
     */
	if (content.length > 0) {

		content.forEach (arrBlended => {

			switch (getTypeBasedOnElementID (arrBlended [0])) {
				case MEDIASITE: addMediaSiteContent (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3], arrBlended [4]); break;
				case STREAM: addStreamContent (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3], arrBlended [4]); break;
				case YOUTUBE: addYoutubeContent (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3], arrBlended [4]); break;
				case WOOCLAP: addWooclapContent (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3]); break;
				case ANSWER: makeAnswerToggable (arrBlended [0], arrBlended [1], arrBlended [2]); break;
				case DOWNLOAD: createDownloadContainer (arrBlended [0], arrBlended [1], arrBlended [2], arrBlended [3]); break;
				default: console.log ('Unknown blended wrapper found');
			}
		});

		createViewersVoorCodeSmellCheatSheets ();
		createPDFViewers ();
	}
};

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Deze function wordt aangeroepen als de pagina is geladen en wordt gebruikt om
 * de wrapper open en dicht te klappen, als op de link 'inline' wordt geklikt.
 */
function toonInlineContent (strElementID) {

	var strType = getTypeBasedOnElementID (strElementID);
	// Als de padding onderaan de content moet worden aangepast (omdat er anders een grote ruimte
	// onder de content ontstaat), wordt deze variabele true.
	var blnPaddingBottomMustBeToggled = ((strType == MEDIASITE) || (strType == STREAM) || (strType == YOUTUBE) || (strType == WOOCLAP)) ? true : false;
	// De variabele divElement bevat de content die (on-)zichtbaar gemaakt moet worden.
	var divElement = document.getElementById (strElementID + '-toggable-content');

    /*
     * Afhankelijk van de zichtbaarheid van de content wordt die zichtbaar of onzichtbaar gemaakt.
     */
	if (divElement.style.display == 'none') {

		divElement.style.display = 'block';

		if (blnPaddingBottomMustBeToggled) {
			divElement.style.paddingBottom = "25px";
		}
	} 
	else {

		divElement.style.display = 'none';

		if (blnPaddingBottomMustBeToggled) {
			divElement.style.paddingBottom = "0px";
		}
	}
}

// /////////////////////////////////////////////////////////////////////////// //

/* 
 * Bepaal welke wrapper een id strElementID heeft en ken dit element de correcte class toe
 * (gebaseerd op het type van de wrapper).
 */
function getElementByIdAndAddClasses (strElementID, strType) {
	var divElement = document.getElementById (strElementID);
	divElement.classList.add (strType + '-wrapper');
	return divElement;
}

/*
 * Gebaseerd op het type van de wrapper wordt het juiste icoontje getoond.
 */
function getIconHTML (strType) {

    var strIconName;

	switch (strType) {
		case MEDIASITE: strIconName = "Play"; break;
		case STREAM: strIconName = "Play"; break;
		case YOUTUBE: strIconName = "Play"; break;
		case WOOCLAP: strIconName = "Proeftoets"; break;
		case ANSWER : strIconName = "Uitwerking"; break;
		case DOWNLOAD: strIconName = "Download"; break;
		default: strIconName = "Onbekend";
	}

	return '<div class="icon-div">' + 
	       '    <img src="' + strRootDir + '/media/Algemeen - ' + strIconName + '.png" class="icon-img">' +
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
		strStyle = '"display:none; padding-bottom: 0px;"';
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
 * paragraaf en titel van een mediasite-video worden met de link naar de video toegevoegd
 * aan een lijst met video's die op deze pagina zijn toegevoegd.
 */
function addVideoContentToList (strVideoID, strParagraph, strTitle, strType = MEDIASITE) {

	/*
	 * De lijst met video's staat normaal gesproken in de UL met id '#video-list'. Maar vanwege
	 * legacy kan het zijn dat de lijst met video's nog in een UL met de id '#mediasite-list' staat.
	 */
	var ulElement = document.getElementById ('video-list');

	if (!ulElement) {
		ulElement = document.getElementById ('mediasite-list');
	}

	if (ulElement != null) {

		var liElement = document.createElement ('li');
		var strBaseURL = "";

		switch (strType) {
			case MEDIASITE: strBaseURL = MEDIASITE_BASE_URL; break;
			case STREAM: strBaseURL = STREAM_BASE_URL; break;
			case YOUTUBE: strBaseURL = YOUTUBE_BASE_URL; break;
		}

		liElement.innerHTML += '<a href="' + strBaseURL + strVideoID + '"' + 
							   '   target="_blank" rel="noreferrer noopener">' + 
							   '	' + strParagraph +
							   '	- ' + strTitle +
							   '</a>';

		ulElement.appendChild (liElement);
	}
}

/*
 * Op basis van een id, een mediasite-id, een paragraaf en een titel wordt een video-wrapper
 * gevuld met de juiste content.
 */
function addMediaSiteContent (strElementID, strMediaSiteID, strParagraph, strTitle, strVisibility) {

	var divMediasite = getElementByIdAndAddClasses (strElementID, MEDIASITE);
	var strLink = MEDIASITE_BASE_URL + strMediaSiteID;
	var strVisibleContent   = 'Bekijk de video <em><a class="videoLink">inline</a></em> ' + 
		                      'of <em><a href="' + strLink + '"' +
		                      '          onclick="toonInlineContent (\'' + strElementID + '\');" ' +
		                      '          target="_blank" class="videoLink">fullscreen</a></em> ' +
		                      '- ' + strTitle;
	var strInvisibleContent = '	   <div class="mediasite-toggable-content">' + 
		                      '        <iframe class="mediasite-iframe"' +
		                      '			       frameborder="0" scrolling="auto" marginheight="0" marginwidth="0"' + 
		                      '                src="' + strLink + '" allow="fullscreen" data-mce-fragment="1">' + 
		                      '        </iframe>' +
		                      '    </div>';
		
	divMediasite.innerHTML = getToggleWrapper (strElementID, MEDIASITE, strVisibleContent, strInvisibleContent, strVisibility);

    /*
     * Alle Mediasite-, MS Stream- en YouTube-video's worden in een lijst (bijv. bovenaan de pagina) verzameld en getoond.
     */
	addVideoContentToList (strMediaSiteID, strParagraph, strTitle, MEDIASITE);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van een id, een stream-id, een paragraaf en een titel wordt een video-wrapper
 * gevuld met de juiste content.
 */
function addStreamContent (strElementID, strStreamID, strParagraph, strTitle, strVisibility) {

	var divStream = getElementByIdAndAddClasses (strElementID, STREAM);
	var strIDLink = strStreamID + '?autoplay=false&showinfo=true';
	var strLink = STREAM_BASE_URL + strIDLink;
	var strEmbedLink = 'https://web.microsoftstream.com/embed/video/' + strIDLink; 
	var strVisibleContent   = 'Bekijk de video <em><a class="videoLink">inline</a></em> ' + 
		                      'of <em><a href="' + strLink + '"' +
		                      '          onclick="toonInlineContent (\'' + strElementID + '\');" ' +
		                      '          target="_blank" class="videoLink">fullscreen</a></em> ' +
		                      '- ' + strTitle;
	var strInvisibleContent = '	   <div class="stream-toggable-content">' + 
		                      '        <iframe width="780" height="439" class="stream-iframe" allowfullscreen' +
		                      '			       frameborder="0" scrolling="auto" marginheight="0" marginwidth="0"' + 
		                      '                src="' + strEmbedLink + '" allow="fullscreen" data-mce-fragment="1">' + 
		                      '        </iframe>' +
		                      '    </div>';
	divStream.innerHTML = getToggleWrapper (strElementID, STREAM, strVisibleContent, strInvisibleContent, strVisibility);

    /*
     * Alle Mediasite-, MS Stream- en YouTube-video's worden in een lijst (bijv. bovenaan de pagina) verzameld en getoond.
     */
	addVideoContentToList (strStreamID, strParagraph, strTitle, STREAM);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van een id, een youtube-id, een paragraaf en een titel wordt een video-wrapper
 * gevuld met de juiste content.
 */
function addYoutubeContent (strElementID, strYoutubeID, strParagraph, strTitle, strVisibility) {

	var divYoutube = getElementByIdAndAddClasses (strElementID, YOUTUBE);
	var strIDLink = strYoutubeID + '?autoplay=false&showinfo=true';
	var strLink = YOUTUBE_BASE_URL + strIDLink;
	var strEmbedLink = 'https://www.youtube.com/embed/' + strIDLink; 
	var strVisibleContent   = 'Bekijk de video <em><a class="videoLink">inline</a></em> ' + 
		                      'of <em><a href="' + strLink + '"' +
		                      '          onclick="toonInlineContent (\'' + strElementID + '\');" ' +
		                      '          target="_blank" class="videoLink">fullscreen</a></em> ' +
		                      '- ' + strTitle;
	var strInvisibleContent = '	   <div class="youtube-toggable-content">' + 
		                      '        <iframe width="780" height="439" class="youtube-iframe" allowfullscreen' +
		                      '			       frameborder="0" scrolling="auto" marginheight="0" marginwidth="0"' + 
		                      '                src="' + strEmbedLink + '" allow="fullscreen" data-mce-fragment="1">' + 
		                      '        </iframe>' +
		                      '    </div>';
	divYoutube.innerHTML = getToggleWrapper (strElementID, YOUTUBE, strVisibleContent, strInvisibleContent, strVisibility);

    /*
     * Alle mediasite-, MS Stream- en YouTube-video's worden in een lijst (bijv. bovenaan de pagina) 
     * verzameld en getoond.
     */
	addVideoContentToList (strYoutubeID, strParagraph, strTitle, YOUTUBE);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van een id, een wooclap-dir en een type (proeftoets of vraag) wordt een 
 * wooclap-wrapper gevuld met de juiste content.
 */
function addWooclapContent (strElementID, strWooclapDir, strType, strVisibility) {

	var divWooclap = getElementByIdAndAddClasses (strElementID, WOOCLAP);
	var strURL = 'https://app.wooclap.com/' + strWooclapDir;
	var strHref = '<a href="' + strURL + '"' + 
                  '   onclick="toonInlineContent (\'' + strElementID + '\');" ' +
				  '   class="videoLink" target="_blank" rel="noreferrer noopener">' +
	              '    <em>full screen</em>' +
	              '</a>'; 
	var strVisibleContent = '<p class="wooclap-p">';

	/*
	 * Bij verschillende types (vragenlijst of proeftoets) worden verschillende clickable teksten getoond.
	 */
	if (strType.toLowerCase	() == 'vraag') {
		strVisibleContent = 'Zou je nu nog <a class="videoLink"><em>inline</em></a> of' + strHref + ' een paar vragen ' +
							'willen beantwoorden? Ik gebruik jullie antwoorden bij de voorbereiding van het hoorcollege.';
	}
	else if (strType.toLowerCase () == 'proeftoets') {
		strVisibleContent = 'Tijdens het hoorcollege liepen we samen door een proeftoets heen die ' +
			  				'helpt om inzicht te krijgen in je begrip van de behandelde stof. Na ' +
							'afloop van het hoorcollege kun je deze proeftoets hier <a class="videoLink"><em>inline</em></a> of ' +
							strHref + ' opnieuw doorlopen.';
	}

	strVisibleContent  += '</p>' +
						  '<p class="wooclap-melding">' +
						  '    Om deze vragenlijst op Wooclap in te vullen, moet je inloggen met je studentaccount.' +
						  '    Zoek op de pagina naar de knop met "De Haagse Hogeschool", log in en geef (als je dat nog niet eerder hebt gedaan) toestemming' +
						  '    om je gegevens te delen met Wooclap.' +
						  '</p>';
	strInvisibleContent	= '<iframe width="100%" height="800" allowfullscreen="allowfullscreen" frameborder="0"' +
						  '        mozallowfullscreen="mozallowfullscreen"' +
						  '        src="' + strURL + '">' + 
						  '</iframe>';

	divWooclap.innerHTML = getToggleWrapper	(strElementID, WOOCLAP, strVisibleContent, strInvisibleContent, strVisibility);
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Op basis van een paragraafnummer wordt de uitwerking voor een opdracht opgemaakt.
 */
function makeAnswerToggable (strElementID, strParagraph) {

	var strBlendedWrapperClass = 'blended-wrapper';

    /*
     * De bestaande content wordt opgevraagd (en de class en id worden verwijderd).
     */
    var elmContent = document.getElementById (strElementID);
    elmContent.classList.remove (strBlendedWrapperClass);
    elmContent.removeAttribute (strElementID);

    var strVisibleContent   = 'Klik <em><a class="videoLink">hier</a></em> om de uitwerking van opgave ' +
		                      strParagraph + ' (on-)zichtbaar te maken.';

	/*
	 * De bestaande content (in elmContent) wordt onderdeel van de (in eerste instantie) 
	 * onzichtbare content.
	 */
    var strInvisibleContent	= elmContent.outerHTML;

    /*
     * Er wordt een nieuwe div aangemaakt, zodat de bestaande content daaraan kan worden 
     * toegevoegd (nadat de bestaande id en correcte classes aan het element zijn toegevoegd).
     * Deze id wordt toegevoegd voor de bestaande content.
     */
    var divAnswer = document.createElement ('div');
    divAnswer.setAttribute ('id', strElementID);
    divAnswer.classList.add (strBlendedWrapperClass);
    divAnswer.classList.add (ANSWER + '-wrapper');
    elmContent.parentNode.insertBefore (divAnswer, elmContent);
    divAnswer.innerHTML = getToggleWrapper (strElementID, ANSWER, strVisibleContent, strInvisibleContent);

    /*
     * De bestaande content (die net is gekopieerd naar een nieuwe div) wordt verwijderd
     * (anders zou de content dubbel voorkomen op de pagina).
     */
	elmContent.remove ();
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
 * In deze methode wordt de div opgehaald die voldoet aan de id = elementID.
 */
function addStyleToMainDiv (elementID, x) {
	divElement = document.getElementById (elementID);
	divElement.style.backgroundColor = '#dddddd';
	divElement.style.border = '1px solid black';
	divElement.style.padding = '25px';
	return divElement;
}

// /////////////////////////////////////////////////////////////////////////// //

/*
 * Met deze functie worden alle pdf-viewers aangemaakt die met de tag pdf-viewer
 * zijn gemarkeerd.
 *
 * Deze code heb ik op 30 november 2022 overgenomen van https://codepen.io/mrapol/pen/ObbOdQ
 * en daarna aangepast.
 */
function createPDFViewers () {

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
		divWrapper.classList.add ('set-pdf-viewer-box-shadow');
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

		var elmURL = document.createElement ('p');
		elmURL.style.cssText = 'font-size: 70%; margin-top: -7px;';
		elmURL.innerHTML = 'Je kunt deze PDF ook in een nieuw tabblad bekijken door op ' +
		                   '<a href="' + strDocumentName + '" target="_blank">deze link</a> ' +
		                   'te klikken';
		divWrapper.parentNode.insertBefore (elmURL, divWrapper.nextSibling);
	}
}

/*
 * Met deze functie worden cheat-sheets voor code smells omgevormd tot PDF-viewers.
 */
function createViewersVoorCodeSmellCheatSheets () {

	var arrCheatSheets = document.getElementsByTagName ('code-smell-cheat-sheet');

	while (arrCheatSheets.length > 0) {

		var elmCheatSheet = arrCheatSheets [0];

		var elmTitel = document.createElement ('h3');
		elmTitel.setAttribute ('nummering', 'no');
		elmTitel.innerHTML = 'De Code Smell Cheat Sheet';
		elmCheatSheet.parentNode.insertBefore (elmTitel, elmCheatSheet);

		var elmToelichting = document.createElement ('p');
		elmToelichting.innerHTML = 'Alle Code Smells (met bijbehorende strategieën) zijn overzichtelijk in een Cheat Sheet bij elkaar gebracht. ' +
		                     'Hierin staat alle bekende informatie over Code Smells overzichtelijk op een rij. Deze Cheat Sheet wordt elke ' +
		                     'keer bijgewerkt met de informatie die jullie op dat moment leren. Je vindt hier dus een levend document dat ' +
		                     'groeit en uiteindelijk alle informatie bevat over de Code Smells die je moet kennen.';
		elmCheatSheet.parentNode.insertBefore (elmToelichting, elmTitel.nextSibling);

		var elmCheatSheetViewer = document.createElement ('pdf-viewer');
		elmCheatSheetViewer.setAttribute ('pdf-root', 'relative');
		elmCheatSheetViewer.setAttribute ('pdf', 'documenten/OPT3 - Code Smell Cheat Sheet.pdf');
		elmCheatSheet.parentNode.replaceChild (elmCheatSheetViewer, elmCheatSheet);
	}
}