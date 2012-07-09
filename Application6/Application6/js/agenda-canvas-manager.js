
/*
Cette page est l'endroit ou s'effectue toute la gestion de l'agenda
L'agenda est est dessiné dans un canvas.
Le dessin et la gestion des evenements de l'agenda est codé dans ce fichier
l'idée est de coder une fonction qui sera appelée aux moment opportuns
et qui initialisera l'agenda avec les évènements passés en paramètre

params
events : un tableau contenant en json les évènement à afficher
canvasID: l'id html du canvas sur lequel travailler
detailsID: l'id du div dans lequel les details seront affichés
*/
function agendaCanvasManager(events, canvasID, detailsID) {
    "use strict";
    
    if(events == null) return
    var minPercent = 2
    var CurrentID = 0

    var Mois = new Array (
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre'
        )
    var JoursMois = new Array (
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
        )

    var CategoryColor = {
        'Partenariats': '#eef',
        'Finance': '#999',
        'Sponsoring': '#00f'
    }

    function chevauchement(a, b, c, d) {
        return (a <= d && a >= c)
        || (b <= d && b >= c)
        || (c <= b && c >= a)
        || (d <= b && d >= a)
    }
    
    /*
    l'idée ici sera de transformer des dates en pourcentage
    exemple :
        sur une plage de temps allant du 1/2/2012 au 30/6/2012
        la date 1/2/2012 correspond à 0% et 30/6/2012 à 100%

    cette méthode retourne le pourcentage correspondant à une date
    en fonction d'une période donnée
    */
    function getPercentage(date, periode) {
     
        var array = date.split('/')
        var d = parseInt(array[0])
        var m =
                (
                    (parseInt(array[1])) +
                    12 * (parseInt(array[2]) - periode.anneeDepart)
                )
                - periode.moisDepart

        var monthBase = 40//JoursMois[parseInt(array[1]) - 1] + minPercent
        var dayFrac = (d - 1) / monthBase

        var percent = 100 * (m + dayFrac) * (1 / 6)
        if (percent < 0) percent = 0
        else if (percent > 100) percent = 100

        return percent
    }

    /*
    transforme un pourcentage en angle (entre 0 et 2PI)
        50% => PI
        75% => 3PI/4
    */
    function convertIntoAngle(percent) {
        return (Math.PI * 2 * percent / 100) 
    }

    /*
    cet élément est l'objet qui va gérer le contenu du canvas
    (en faisant appel aux fonctionx précédentes)
    */
    var mngr = {

        elId: canvasID,
        detId: detailsID,

        center: {
            x: 350,
            y: 450
        },

        border:3,

        height: 700,

        width:700,

        thickness: 40,

        space:0,

        ctx : null,

        /*
        initialisation du canvas (evenements, récupération du contexte ...)
        */
        init: function (moisDebut) {

            var moisDepartTmp = parseInt(moisDebut.split('/')[1]) 
            var tmp = new Array()
            for (var i = 0; i < 6 ; ++i) {
                tmp[i] = (moisDepartTmp + i) % 12
            }
            this.Periode = {
                anneeDepart: moisDebut.split('/')[2],
                moisDepart:moisDepartTmp,
                mois: tmp
            }

            var canvas = document.getElementById(this.elId);
            this.ctx = canvas.getContext("2d");

            this.ctx.beginPath();
            this.ctx.canvas.width = this.width
            this.ctx.canvas.height = this.height
            this.ctx.scale(1, 0.7);

            var agendaDisplay = '#'+this.elId
            
            $(agendaDisplay).click(function (e) {
                var x = Math.floor((e.pageX - $(agendaDisplay).offset().left));
                var y = Math.floor((e.pageY - $(agendaDisplay).offset().top));
                mngr.handleClick(x,y)
            });

        },

        /*
        fonction déclenchée lors d'un click dans le canvas
        son but est de transformer les coordonnée du click en coordonnéees polaires,
        de trouver sur quel cercle se trouve le click et
        de s'en servir pour savoir sur quel évènement le click est déclenché
        */
        handleClick: function (x, y) {
            var space2 = this.space * this.space
            var thickness2 = (this.thickness + this.border) * (this.thickness + this.border)
            y = y * (1 / 0.7)
            var dist2 = (x - this.center.x) * (x - this.center.x)
            + (y - this.center.y) * (y - this.center.y)

            var stage = null
            for (var i = 0; i < 10; ++i) {
                var i2 = i * i
                var j2 = (i + 1) * (i + 1)
                if (dist2 <= j2 * thickness2 && dist2 >= i2 * thickness2) {
                    stage = i
                    break
                }
            }

            var angle = Math.acos((x - this.center.x) / Math.sqrt(dist2))
            if (y < this.center.y)
                angle = Math.PI  - angle
            else
                angle = Math.PI  + angle
            this.selectEvent(angle, stage)
        },

        /*
        dessinne le repère et les noms des mois
        */
        drawRepere: function () {

            this.ctx.beginPath();
            this.ctx.canvas.width = this.width
            this.ctx.canvas.height = this.height
            this.ctx.scale(1, 0.7);

            this.ctx.moveTo(this.center.x, this.center.y)
            this.ctx.lineTo(10, this.center.y)
            this.ctx.strokeText('Février', 10, this.center.y - 10)

            this.ctx.moveTo(this.center.x, this.center.y)
            this.ctx.lineTo(2 * this.center.x - 10, this.center.y)
            this.ctx.strokeText('Mai', 2 * this.center.x - 30, this.center.y + 15)

            this.ctx.moveTo(this.center.x, this.center.y)
            this.ctx.lineTo(this.center.x / 2, this.center.y * (1 - Math.sqrt(3) / 2))
            this.ctx.strokeText('Mars', this.center.x / 2 + 10, this.center.y * (1 - Math.sqrt(3) / 2))



            this.ctx.moveTo(this.center.x, this.center.y)
            this.ctx.lineTo(this.center.x * (1 + 1 / 2), this.center.y * (1 - Math.sqrt(3) / 2))
            this.ctx.strokeText('Avril', this.center.x * (1 + 1 / 2) + 10, this.center.y * (1 - Math.sqrt(3) / 2) + 10)

            this.ctx.moveTo(this.center.x, this.center.y)
            this.ctx.lineTo(this.center.x / 2, this.center.y * (1 + Math.sqrt(3) / 2))
            this.ctx.strokeText('Juillet', this.center.x / 2 - 30, this.center.y * (1 + Math.sqrt(3) / 2))

            this.ctx.moveTo(this.center.x, this.center.y)
            this.ctx.lineTo(this.center.x * (1 + 1 / 2), this.center.y * (1 + Math.sqrt(3) / 2))
            this.ctx.strokeText('Juin', this.center.x * (1 + 1 / 2) - 30, this.center.y * (1 + Math.sqrt(3) / 2), 70)

            this.ctx.strokeStyle = '#aaa';
            
            //this.ctx.strokeText('Blabla', this.center.x * (1 + 1 / 2), this.center.y * (1 + Math.sqrt(3) / 2))


            var test = this.center.x + " " + this.center.y


            this.ctx.lineWidth = 2
            this.ctx.stroke()
            this.ctx.closePath()
            this.ctx.save()
        },

        /*
        dessine un arc de cercle (colorié sur les bordure et à l'intérieur)
        utilisé pour dessinner les evenements
        params :
        s:angle correspondant au début de l'arc
        s:angle correspondant à la fin de l'arc
        r:la distance part rapport à l'origine
        */
        drawArc: function (s, e, r, color) {

            r = r * (this.thickness + this.border) + this.space

            this.ctx.beginPath();
            var span = this.thickness

            var sAngle = s + Math.PI
            var eAngle = e + Math.PI

            this.ctx.arc(this.center.x, this.center.y, r, sAngle, eAngle, false)
            this.ctx.arc(this.center.x, this.center.y, r + this.thickness, eAngle, sAngle, true)

            // line color
            this.ctx.lineWidth = 3
            this.ctx.strokeStyle = '#fff';
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.stroke()
            this.ctx.save()

        },



        /*
        dessine un arc de cercle (colorié sur les bordures uniquement)
        utilisé pour dessinner la sélection des evenements
        params :
        s:angle correspondant au début de l'arc
        s:angle correspondant à la fin de l'arc
        r:la distance part rapport à l'origine
        */
        drawArcBorder: function (s, e, r, color, width) {

            r = r * (this.thickness + this.border) + this.space

            this.ctx.beginPath();
            var span = this.thickness

            var sAngle = s + Math.PI
            var eAngle = e + Math.PI

            this.ctx.arc(this.center.x, this.center.y, r, sAngle, eAngle, false)
            this.ctx.arc(this.center.x, this.center.y, r + this.thickness, eAngle, sAngle, true)
            
            // line color
            this.ctx.closePath()
            this.ctx.lineWidth = width
            this.ctx.strokeStyle = color;
            this.ctx.stroke()
            this.ctx.save()
            
        },

        /*
        dessine dans le canvas tous les évènements qui ont été ajoutés
        */
        display: function () {
            var this_list = this.list

            this_list.onEach(function (evt, ind) {
                evt.line = 1
                this_list.onEach(function (evt2, j) {
                    if (evt2.line != -1 && evt2.id != evt.id &&
                        chevauchement(evt.start, evt.end, evt2.start, evt2.end) &&
                        evt2.line >= evt.line) {
                            evt.line = evt2.line + 1
                    }
                })

                mngr.drawArc(evt.startAngle, evt.endAngle, evt.line, CategoryColor[evt.content.category])
            })
        },

        addedEvents: new Array(),

        selectedEvent: null,

        /*
        fonction de sélection d'évènements en fonction d'un angle et d'une distance
        */
        selectEvent: function (angle, stage) {

            for (var i = 0; i < this.addedEvents.length; ++i) {

                var event = this.addedEvents[i]
                if (angle <= event.endAngle && angle >= event.startAngle && stage ==  event.line) {
                    
                    if (this.selectedEvent != null) {
                        this.drawArcBorder(
                            this.selectedEvent.startAngle,
                            this.selectedEvent.endAngle,
                            this.selectedEvent.line,
                            '#fff', 3)
                    }

                    this.selectedEvent = event
                    this.drawArcBorder(
                            this.selectedEvent.startAngle,
                            this.selectedEvent.endAngle,
                            this.selectedEvent.line,
                            '#7f7', 2)

                    var detailsdiv = $('#' + this.detId)
                    $('#agendaDetailsTitle', detailsdiv).html(this.selectedEvent.content.title)
                    $('#agendaDetailsDescription', detailsdiv).html(this.selectedEvent.content.description)
                    $('#agendaDetailsDate', detailsdiv).html(this.selectedEvent.content.textdate)
                    $('#agendaDetailsLieu', detailsdiv).html(this.selectedEvent.content.textlieu)
                    //$('#agendaDetailsImage img', detailsdiv).attr('src', infos.Root + '/' + this.selectedEvent.content.postername)
                    $('#agendaDetailsImage img', detailsdiv).attr('src', this.selectedEvent.content.postername)
                    $('#agendaDetailsImage img', detailsdiv).css('display', 'inline')

                    break
                }
            }
        },

        /*
        insertion dans la liste des évènements de manière ordonnée
        */
        insertOrderedList: function (evnt) {
            var ind = null
            this.list.onEach(function (evt, i) {
                if (evt.end - evt.start <= evnt.end - evnt.start) {
                    ind = i
                    return false
                }
            })
            if(ind > 0)
                this.list.insertInList(evnt, ind)
            else if(ind == null)
                this.list.insertInList(evnt)
            else this.list.insertInList(evnt, 0)
        },

        /*
        fonction appelée pour rajouter un evenement
        */
        addEvent: function (details) {

            var s = getPercentage(details.startdate, this.Periode)
            var e = getPercentage(details.enddate, this.Periode)
            if (e < s + minPercent)
                e = s + minPercent
            var sAngle = convertIntoAngle(s)
            var eAngle = convertIntoAngle(e)
            var lineVal = 1

            this.list.onEach(function(evt,i){
                if (chevauchement(evt.start, evt.end, s, e) && evt.line >= lineVal) {
                    lineVal = evt.line + 1
                }
            })

            var evt = {
                startAngle: sAngle,
                endAngle: eAngle,
                start: s,
                end: e,
                content: details,
                id:CurrentID++,
                line: -1
            }
            this.insertOrderedList(evt)
            this.addedEvents.push(evt)
        },

        list: {
            items: new Array(),
            start: -1,
            end: -1,
            getItemInList: function (i) {
                var item = this.items[this.start]
                while (i-- > 0) {
                    item = this.items[item.next]
                }
                return item
            },

            onEach: function (handler) {
                var nxt
                var ind = 0
                for (var i = this.start; i != -1 ; i = nxt) {
                    var evt = this.items[i].item
                    nxt = this.items[i].next
                    var ret = handler(evt, ind)
                    if (ret == false)
                        return
                    ind++
                }
            },

            insertInList: function (elt, i) {
                if (i != null) {
                    if (i > 0) {
                        var prev = this.getItemInList(i - 1)
                        this.items.push({
                            item: elt,
                            next: prev.next
                        })
                        if (prev.next == -1)
                            this.end = this.items.length - 1
                        prev.next = this.items.length - 1
                    }
                    if (i == 0) {
                        this.items.push({
                            item: elt,
                            next: this.start
                        })
                        if (this.start == -1)
                            this.end = 0
                        this.start = this.items.length - 1

                    }
                } else {
                    if (this.start == -1)
                        this.start = this.end = 0
                    else {
                        var last = this.items[this.end]
                        last.next = this.end = this.items.length
                    }
                    this.items.push({
                        item: elt,
                        next: -1
                    })
                }
            },
        }

    }

    mngr.init('01/02/2012')
    mngr.drawRepere()
        
    for (var i = 0; i < events.length ; ++i)
        mngr.addEvent(events[i])

    mngr.display()

}