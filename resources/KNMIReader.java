import java.io.*;
import java.util.Scanner;

public class KNMIReader {

    /*
     * Constanten voor Scanner, PrintWriter en BufferedReader.
     */
    private static final int IN = 1;
    private static final int OUT = 2;
    private static final int READER = 3;

    /*
     * Constanten voor de file met weergegevens.
     */
    private static final int AANTAL_REGELS_IN_UITLEG = 51;
    /*
     * De file is terug te vinden in "resources\weergegevens (1901 - 2022).txt".
     */
    private static final String FILENAAM = "weergegevens (1901 - 2022)";

    /*
     * In deze property wordt de titel opgeslagen die boven de kolom met data staat die ingelezen
     * moet worden. De kolom met maximum temperaturen heeft bijv. de naam "TX".
     */
    private String kolomtitel;

    /*
     * kolomnummer wordt bepaald a.d.h.v. de naam boven de kolom (die in kolomtitel wordt bewaard).
     */
    private int kolomnummer;

    /*
     * reader blijft in het geheugen beschikbaar zodat er ook voor een andere maand of
     * een ander jaar gebruik van gemaakt kan worden (nog niet geïmplementeerd).
     */
    private BufferedReader reader;

    /*
     * De gegevens voor (maand in) jaar worden vanuit de file met FILENAAM gekopieerd naar deze array.
     * In gegevens worden de gegevens opgeslagen die in één specifieke kolom staan (bijv. in de kolom
     * met de titel kolomtitel; bijv. "TX").
     *
     * De property maand is gelijk aan -1 als de gegevens voor een heel jaar worden opgevraagd.
     */
    private double [] gegevens = new double [0];
    private int jaar;
    private int maand;

    /*
     * Met deze methode wordt een Scanner (als inOrOut de waarde IN heeft),
     * een PrintWriter (inOrOut == OUT) of een BufferedReader aangemaakt die
     * verwijst naar de File met filenaam.
     *
     * Als daar een probleem mee is, wordt om een andere filenaam gevraagd (net
     * zolang tot de file wel beschikbaar is voor lezen of schrijven).
     */
    private Object getFileIOObject (String filenaam, int inOrOut) {

        Scanner in = null;
        PrintWriter out = null;
        BufferedReader reader = null;

        /*
         * Omdat deze methode gaat over objecten waarmee je zowel kunt lezen uit als kunt schrijven naar
         * een file, wordt daar voor de gebruiker onderscheid in gemaakt.
         */
        String doel = "waaruit u wilt lezen";

        if (inOrOut == OUT) {
            doel = "waarin u gegevens wilt bewaren";
        }

        /*
         * Als nog geen filenaam is opgegeven, wordt die hier ingelezen vanaf het
         * toetsenbord.
         */
        if ((filenaam == null) || (filenaam == "")) {

            Scanner toetsenbord = new Scanner (System.in);
            System.out.printf ("Geef de naam van de file %s: ", doel);
        }

        /*
         * Als nog geen Scanner, PrintWriter of BufferedReader is aangemaakt (omdat dit
         * niet lukt), wordt net zolang om een nieuwe filenaam gevraagd tot het wel lukt.
         */
        while ((in == null) && (out == null) && (reader == null)) {

            try {
                File bestand = new File (String.format ("resources\\%s.txt", filenaam));

                switch (inOrOut) {
                    case IN:
                        return new Scanner (bestand);
                    case OUT:
                        return new PrintWriter (bestand);
                    case READER:
                        FileReader fr = new FileReader (bestand);
                        return new BufferedReader (fr);
                    default:
                        return null;
                }
            }
            catch (IOException e) {
                System.out.printf ("Kunt u a.u.b. een correcte filenaam van een file, %s, invoeren? ", doel);
                filenaam = new Scanner (System.in).nextLine ();
            }
        }

        return null;
    }

    /*
     * Met deze methode wordt tot het einde van een regel gelezen uit de file. De inhoud
     * van (het overblijvende gedeelte van) de regel wordt teruggegeven.
     */
    private String leesRegel () {

        try {
            return reader.readLine();
        }
        catch (IOException e) {
            return "";
        }
    }

    /*
     * De eerste 47 regel bovenaan de File met uitleg worden weg gelezen.
     */
    private void leesUitleg () {
        for (int i = 0; i < AANTAL_REGELS_IN_UITLEG; i++) {
            leesRegel ();
        }
    }

    /*
     * Elke kolom loopt vanaf de positie na een komma t/m de volgende komma. De inhoud
     * van de kolom (zonder komma) wordt ontdaan van spaties/enters en teruggegeven.
     */
    private String leesKolom () {

        String kolomdata = "";

        try {
            int karakter = reader.read();

            while ((karakter != -1) && (karakter != 44) && (karakter != 10)) {
                kolomdata += (char) karakter;
                karakter = reader.read ();
            }
        }
        catch (IOException e) {
            System.out.println ("leesKolom: Fout in read; reeds gelezen: " + kolomdata);
        }

        return kolomdata.trim ();
    }

    /*
     * In de header staan alle kolomnamen gescheiden door komma's. Er wordt gezocht
     * naar de kolom met kolomnaam (bijv. "TX"). Bij het zoeken wordt geteld in de
     * hoeveelste kolom deze kolomnaam voorkomt en dat kolomnummer wordt terug gegeven.
     */
    private int getKolomnummer() {

        String kolomnaam = "";
        int teller = 0;

        while (!kolomnaam.equals (kolomtitel)) {
            kolomnaam = leesKolom ();
            teller++;
        }

        return teller;
    }

    /*
     * De gegevens zijn opgeslagen als een geheel getal. De data in de eerstvolgende kolom wordt
     * als een getal geïnterpreteerd.
     */
    private int leesVolgendeGeheleGetal () {
        return Integer.parseInt (leesKolom());
    }

    /*
     * Eventueel wordt een maand vooraf gegaan door een '0'. januari 2020 wordt dan 202001 en
     * december 2020 wordt 202012.
     */
    private String getMaandString (int maand) {

        String resultaat = "" + jaar;

        if (maand < 10) {
            resultaat += "0";
        }

        return resultaat + maand;
    }

    /*
     * Op basis van de met het in de constructor meegegeven jaar en de meegegeven maand
     * wordt een eersteDagString bepaald. De eerste dag van mei 2020 wordt weergeven als
     * 20200501.
     *
     * Als de gegevens voor een jaar ingelezen moeten worden (bijv. 2020), dan is de eerste
     * dag van het jaar 20200101.
     */
    private String getEersteDagString () {

        String maandString = "";

        if (maand == -1) {
            maandString = getMaandString (1);
        }
        else {
            maandString = getMaandString (maand);
        }

        return maandString + "01";
    }

    /*
     * Een jaar is een schrikkeljaar, als:
     * - Een jaar deelbaar is door 4, maar niet door 100.
     * - Uitzondering is als een jaar deelbaar is door 400.
     */
    private boolean isSchrikkeljaar () {
        return (jaar % 400 == 0) || ((jaar % 100) != 0 && (jaar % 4 == 0));
    }

    /*
     * De laatste dag van het jaar (bijv. 2020; als maand -1 is) is 20201231. De laatste dag
     * van een maand (bijv. maart 2020) is 20200330.
     */
    private String getLaatsteDagString () {

        String resultaat;

        if (maand == -1) {
            resultaat = getMaandString (12);
        }
        else {
            resultaat = getMaandString (maand);
        }

        int aantalDagen = 0;

        /*
         * De property maand mag niet worden overschreven. Daarom wordt voor het bepalen van
         * de laatste dag van de maand (of van het jaar) gebruik gemaakt van de hulpvariabele
         * actieveMaand.
         */
        int actieveMaand = maand;

        if (maand == -1) {
            actieveMaand = 12;
        }

        switch (actieveMaand) {

            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                aantalDagen = 31;
                break;
            case 2:
                if (isSchrikkeljaar ()) {
                    aantalDagen = 29;
                }
                else {
                    aantalDagen = 28;
                }

                break;

            case 4:
            case 6:
            case 9:
            case 11:
                aantalDagen = 30;
        }

        return resultaat + aantalDagen;
    }

    /*
     * Gegeven de eersteDagString (de eerste dag van het jaar 2020 is 20200101 en de eerste
     * dag van mei 2020 is 20200501), wordt gezocht in de file naar deze eerste dag.
     */
    private void zoekNaarEersteRegel () throws IOException {

        String zoekterm = getEersteDagString ();
        String maandString = "<leeg>";

        while (!maandString.equals (zoekterm) && !maandString.equals ("")) {
            leesRegel ();
            leesKolom ();
            maandString = leesKolom ();
        }

        if (maandString.equals ("")) {
            throw new IOException ("EOF Reached");
        }
    }

    /*
     * Er wordt een nieuw element toegevoegd aan een array, de oude array
     * wordt gekopieerd naar de nieuwe en de nieuwe waarde wordt eraan toegevoegd.
     * Daarna gaat de array met maximale temperaturen verwijzen naar deze nieuwe
     * array.
     */
    private void voegGetalToeAanArrayMetGegevens (int getal) {

        double [] nieuweArray = new double [gegevens.length + 1];

        for (int i = 0; i < gegevens.length; i++) {
            nieuweArray [i] = gegevens[i];
        }

        /*
         * TODO: Niet alle kolommen zijn in tiende ^C opgeslagen. Dat moet op deze plek worden
         * gewijzigd.
         */
        nieuweArray [gegevens.length] = getal / 10.0;
        gegevens = nieuweArray;
    }

    /*
     * De eerste dag van het jaar of van de maand is gevonden en de hele maand of het hele
     * jaar wordt ingelezen.
     */
    private void vulArrayMetGegevens () {

        boolean isEersteRegel = true;
        String dagString = getEersteDagString ();
        String zoekterm = getLaatsteDagString ();

        /*
         * Als het einde van de file is bereikt (omdat de laatste maand maar gedeeltelijk in
         * de file is opgenomen en dus ook maar een gedeelte van een jaar is opgenomen), moet
         * de loop ook worden beëindigd.
         *
         * Maar het doel van deze while is dat alle regels tot en met de regel met de laatste
         * dag in de maand (bijv. 20201130) of het jaar (bijv. 20191231) worden ingelezen.
         */
        while (!dagString.equals (zoekterm) && !dagString.equals ("")) {

            /*
             * Als de eerste regel wordt gelezen, is de datumkolom al gelezen. Dat mag
             * dus niet opnieuw gebeuren.
             */
            if (isEersteRegel) {
                isEersteRegel = false;
            }
            else {
                leesRegel (); // De kolommen na de gezochte kolom (met bijv. de titel "TX") worden overgeslagen.
                leesKolom (); // De eerste kolom met de code van de plaats wordt overgeslagen.
                dagString = leesKolom (); // De tweede kolom bevat de datum.
            }

            /*
             * Er wordt gezocht naar de kolom waarboven de kolomtitel staat (bijv. "TX" voor maximale temperatuur).
             */
            for (int i = 0; i < kolomnummer - 3; i++) {
                leesKolom();
            }

            /*
             * Als de laatste regel van de file is bereikt, mag de lege waarde
             * niet in de Array worden opgeslagen.
             */
            if (!dagString.equals ("")) {
                voegGetalToeAanArrayMetGegevens (leesVolgendeGeheleGetal());
            }
        }
    }

    /*
     * De eerste stappen voor het lezen worden gezet:
     * - De array met gegevens wordt geïnitialiseerd met 0 elementen.
     * - De eerste regel (met de juiste startdatum) wordt opgezocht in de file.
     * - De array met gegevens wordt gevuld.
     */
    private void leesGegevens () {
        try {
            gegevens = new double[0];
            zoekNaarEersteRegel();
            vulArrayMetGegevens();
            reader.close ();
        }
        catch (IOException e) {
            if (e.getMessage().equals ("EOF Reached")) {
                System.out.printf ("zoekNaarEersteRegel: De datum %s komt niet voor in de file.%n",
                                   getEersteDagString ());
            }
            else {
                System.out.println ("leesGegevens: Het lukt niet om de file te sluiten");
            }
        }
    }

    /*
     * Deze constructor zorgt voor de voorbereiding van het lezen van de jaar- en maand-
     * data. Er wordt een reader aangemaakt, de uitleg wordt weg gelezen en het nummer
     * van de kolom (met daarboven de titel met de waarde titelKolom) waarin de gegevens
     * zijn opgenomen wordt vastgesteld.
     */
    private KNMIReader (String kolomtitel) {
        reader = (BufferedReader) getFileIOObject (FILENAAM, READER);
        leesUitleg ();
        this.kolomtitel = kolomtitel;
        kolomnummer = getKolomnummer();
    }

    /*
     * De gegevens voor een specifieke maand worden gekopieerd naar de Array met gegevens.
     * Met de parameter titelKolom wordt aangegeven voor welke kolom (de titel die boven
     * die kolom staat) de gegevens ingelezen moeten worden.
     */
    public KNMIReader (int jaar, int maand, String kolomtitel) {
        this (kolomtitel);
        this.jaar = jaar;
        this.maand = maand;
        leesGegevens ();
    }

    /*
     * De gegevens voor een specifieke maand worden gekopieerd naar de Array met gegevens.
     * Als geen titel voor een kolom wordt opgegeven aan de Constructor, dan gaat
     * KNMIReader ervan uit dat de gegevens voor de maximum temperaturen moeten worden gelezen.
     */
    public KNMIReader (int jaar, int maand) {
        this (jaar, maand, "TX");
    }

    /*
     * De gegevens voor een specifiek jaar worden gekopieerd naar de Array met gegevens.
     * Met de parameter titelKolom wordt aangegeven voor welke kolom (de titel die boven
     * die kolom staat) de gegevens ingelezen moeten worden.
     */
    public KNMIReader (int jaar, String kolomtitel) {
        this (jaar, -1, kolomtitel);
    }
    /*
     * De gegevens voor een specifiek jaar worden gekopieerd naar de Array met gegevens.
     * Als geen titel is gegeven wordt ervan uitgegaan dat de maximum dagtemperaturen (met
     * de titel "TX" boven de kolom) moeten worden ingelezen.
     */
    public KNMIReader (int jaar) {
        this (jaar, "TX");
    }

    public double [] getGegevens() {
        return gegevens;
    }

    /*
     * Om een goede filenaam te kunnen vaststellen, wordt aan de bestaande FILENAAM
     * het jaar (eventueel vooraf gegaan door een maand) toegevoegd.
     */
    public String getPeriodeString () {

        String periodeString = "" + jaar;

        switch (maand) {
            case 1: return "januari " + periodeString;
            case 2: return "febuari " + periodeString;
            case 3: return "maart " + periodeString;
            case 4: return "april " + periodeString;
            case 5: return "mei " + periodeString;
            case 6: return "juni " + periodeString;
            case 7: return "juli " + periodeString;
            case 8: return "augustus " + periodeString;
            case 9: return "september " + periodeString;
            case 10: return "oktober " + periodeString;
            case 11: return "november " + periodeString;
            case 12: return "december " + periodeString;
        }

        return periodeString;
    }

    /*
     * Als de Array met gegevens is gevuld (met de constructor), kunnen die
     * gegevens naar een file worden weg geschreven.
     */
    public void schrijfGegevens () {

        String filenaam = "weergegevens (" + getPeriodeString () + ")";
        PrintWriter out = (PrintWriter) getFileIOObject (filenaam, OUT);

        for (double getal : gegevens) {
            out.printf ("%d ", (int) (getal * 10));
        }

        out.close ();
    }
}