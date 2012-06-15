(function () {
    "use strict";


    var jsonContent = xml2json.parser('<root> <element> <idEvent>158</idEvent> <typeElement>Media</typeElement> <idMediaOuAgenda>88684</idMediaOuAgenda> <urlVideo/> <urlImage>/weceem/WeceemFiles/_ROOT/Image/alaune/Unes_iPad_20120216_2011.png</urlImage> <chapeau>Résultats 2011</chapeau> <content>Des résultats solides et engagements tenus dans un contexte troublé. Une excellente performance industrielle.</content> <date>16/02/2012</date> </element> <element> <idEvent>159</idEvent> <typeElement>Agenda</typeElement> <idMediaOuAgenda>168</idMediaOuAgenda> <urlVideo/> <urlImage>/weceem/WeceemFiles/_ROOT/Image/alaune/Unes_iPad_20120202_kersale.png</urlImage> <chapeau>7 fois plus à l\'Ouest</chapeau> <content>Yann Kersalé expose à l\'Espace Fondation EDF jusqu\'au 25 mars 2012.</content> <date>28/10/2011</date> </element> </root>');
    var homeItems = jsonContent.root.element;
    jsonContent = xml2json.parser('<root> <elements> <idEvent>161</idEvent> <caption>Barrage et retenue de Sainte Croix de Verdon - Détail de la voûte - Amont Crédit photo : EDF - Laurent BARATIER</caption> <portrait>/weceem/WeceemFiles/_ROOT/Image/Carousel/photo01_portrait.png</portrait> <landscape>/weceem/WeceemFiles/_ROOT/Image/Carousel/photo01_paysage.png</landscape> </elements> <elements> <idEvent>162</idEvent> <caption>Ferme solaire à Sacramento - Larry Freeman, responsable du site solaire de Wilton, (SMUD), exploité par enXco, Sacramento, Californie, Etats-Unis.\nCrédit photo : EDF - Sophie BRANDSTROM</caption> <portrait>/weceem/WeceemFiles/_ROOT/Image/Carousel/photo02_portrait.png</portrait> <landscape>/weceem/WeceemFiles/_ROOT/Image/Carousel/photo02_paysage.png</landscape> </elements> <elements> <idEvent>163</idEvent> <caption>Tony Estanquet, figure emblématique du TEAM EDF depuis 2005, porte drapeau de la délégation française à Pékin, double champion olympique et tout nouveau champion du monde de slalom de canoé-kayak en 2009. Crédit photo : EDF - Franck FAUGERE</caption> <portrait>/weceem/WeceemFiles/_ROOT/Image/Carousel/photo03_portrait.png</portrait> <landscape>/weceem/WeceemFiles/_ROOT/Image/Carousel/photo03_paysage.png</landscape> </elements> </root>');
    var homeImages = jsonContent.root.elements;


    WinJS.Namespace.define("data", {
        FrontPageImages: new WinJS.Binding.List(homeImages, { proxy: false }),
        FrontPageItems: new WinJS.Binding.List(homeItems, { proxy: false })
    });
})();