var Multigrid = function() {

    var viewedAndHidden = [];
    var settings = {};

    var Init = function () {
        settings = JSON.parse(localStorage.getItem('denyio.multigrid.settings')) || { "YouTubeID": "", "DailyMotionID": "", "VimeoID": ""};
        $("textarea#settings").html(JSON.stringify(settings, undefined, 2));

        viewedAndHidden = localStorage.getItem('denyio.multigrid.videos.hidden') || [];
    },

    SaveSettings = function() {
        localStorage.setItem('denyio.multigrid.settings', $("textarea#settings").val());

    },

    Load = function () {

    },

    Hide = function (e, id) {
        var ev = e || window.event;

        $('div#'+id).hide();
        console.log(id);
        if(viewedAndHidden.indexOf(id) == -1) {
            viewedAndHidden.push(id);
            localStorage.setItem('denyio.multigrid.videos.hidden', viewedAndHidden);
        }
        ev.stopPropagation();
    },

    loadDmChannels = function ( data, code ) {
        if ( code == 200 ) {
            if ( typeof data != 'undefined' ) {
                var idents = [];

                $.each( data, function ( i, v ) {
                    printDmLink(v);
                } );
            }
            $('#stream>div').tsort({attr:'data-time', order:'desc'});
        }
    },

    loadYtChannels = function ( data, code ) {
        if ( code == 200 ) {
            if ( typeof data != 'undefined' ) {
                var idents = [];

                $.each( data, function ( i, v ) {
                    printYtLink(v);
                } );
            }
            $('#stream>div').tsort({attr:'data-time', order:'desc'});
        }
    },
    
    loadYtChannelsv3 = function (data, code ) {
        $.each( data, function ( i, v ) {
            printYtLinkv3(v);
        } );
        $('#stream>div').tsort({attr:'data-time', order:'desc'});
    },

    loadViChannels = function (data, code) {
        if ( code == 200 ) {
            if ( typeof data != 'undefined' ) {
                var idents = [];

                $.each( data, function ( i, v ) {
                    printViLink(v);
                } );
            }
            $('#stream>div').tsort({attr:'data-time', order:'desc'});
        }
    },

    printDmLink = function (data)
    {
        var time = data['created_time'];

        if(viewedAndHidden.indexOf(data['id']) == -1) {
            $('#stream').append('<div id="' + data['id'] + '" class="thumbnail" data-time="'+ time +'">'
                                    +'<a href="'+ data.url +'" target="_new">'
                                        +'<div class="thumbnail-content">'
                                            +'<div class="image-container">'
                                                //+'<a href="#" class="hide-button" onclick="Multigrid.Hide(event,\''+ data['id'] +'\')">X</a>'
                                                +'<img src="'+ data['thumbnail_180_url'].replace('http:', 'https:') +'"></img>'
                                            +'</div> '
                                            +'<div class="thumb-link">'+ data.title+'</div>'
                                            +'<abbr class="timeago" title="'+ moment(time.toString(), "X").format("ddd MMM DD HH:mm:ss YYYY") +'" data-livestamp="'+ time +'"></abbr>'
                                            +'<span class="thumb-author">by '+ data["owner.username"] +'</span>'
                                        +'</div>'
                                    +'</a>'
                                +'</div>');
        }
    },

    printYtLink = function (data)
    {
        var time = Date.parse(data['published']['$t'])/1000;
        var id = data['id']['$t'].replace( 'https://gdata.youtube.com/feeds/api/videos/', '' ).replace( 'http://gdata.youtube.com/feeds/api/videos/', '' );
        if(viewedAndHidden.indexOf(id) == -1) {
            $('#stream').append('<div id="'+id+ '" class="thumbnail" data-time="'+ time +'">'
                                    +'<a href="https://www.youtube.com/watch?v='+ id +'" target="_new">'
                                        +'<div class="thumbnail-content">'
                                            +'<div class="image-container">'
                                               // +'<a href="#" class="hide-button" onclick="Multigrid.Hide(event,\''+ id +'\')">X</a>'
                                                +'<img src="'+ data['media$group']['media$thumbnail'][0]['url'] +'"></img>'
                                            +'</div>'
                                            +'<div class="thumb-link">'+ data['title']['$t'] + '</div>'
                                            +'<abbr class="timeago" title="'+ moment(data['published']['$t']).format("ddd MMM DD HH:mm:ss YYYY") +'" data-livestamp="'+ moment(data['published']['$t']).format("X") +'"></abbr>'
                                            +'<span class="thumb-author">by '+ data['author'][0]['name']['$t'] +'</span>'
                                        +'</div>'
                                    +'</a>'
                                +'</div>');
        }
    },
    
    printYtLinkv3 = function (data) {
        
        var title = data.snippet.title;
        var id = data.snippet.thumbnails.default.url.replace('https://i.ytimg.com/vi/', '').replace('/default.jpg', '');
        var time = Date.parse(data.snippet.publishedAt)/1000;
        var thumbnail = data.snippet.thumbnails.high.url;
        var channel = data.snippet.channelTitle;
        $('#stream').append('<div id="'+id+ '" class="thumbnail" data-time="'+ time +'">'
                        +'<a href="https://www.youtube.com/watch?v='+ id +'" target="_new">'
                            +'<div class="thumbnail-content">'
                                +'<div class="image-container">'
                                    +'<img src="'+ thumbnail +'"></img>'
                                +'</div>'
                                +'<div class="thumb-link">'+ title + '</div>'
                                //+'<abbr class="timeago" title="'+ moment(time.format("ddd MMM DD HH:mm:ss YYYY")) +'" data-livestamp="'+ moment(time.format("X")) +'"></abbr>'
                                +'<span class="thumb-author">by '+ channel +'</span>'
                            +'</div>'
                        +'</a>'
                    +'</div>');
    },

    printViLink = function (data)
    {
        var time = data['upload_date'];

        if(viewedAndHidden.indexOf(data['id']) == -1) {
            $('#stream').append('<div id="' + data['id'] + '" class="thumbnail" data-time="'+ moment(time).format("X") +'">'
                                    +'<a href="'+ data.url +'" target="_new">'
                                        +'<div class="thumbnail-content">'
                                            +'<div class="image-container">'
                                                //+'<a href="#" class="hide-button" onclick="Multigrid.Hide(event,\''+ data['id'] +'\')">X</a>'
                                                +'<img src="'+ data['thumbnail_medium'] +'"></img>'
                                                //duration name in json is "duration"
                                            +'</div> '
                                            +'<div class="thumb-link">'+ data['title']+'</div>'
                                            +'<abbr class="timeago" title="'+ moment(time.toString()).format("ddd MMM DD HH:mm:ss YYYY") +'" data-livestamp="'+ moment(time).format("X") +'"></abbr>'
                                            +'<span class="thumb-author">by '+ data["user_name"] +'</span>'
                                        +'</div>'
                                    +'</a>'
                                +'</div>');
        }
    },


    getViURL = function() {
        if(settings.VimeoID === "") {
            return "";
        }
        var viurl = "https://vimeo.com/api/v2/"+ settings.VimeoID +"/subscriptions.json";
        return viurl;
    },

    getYtURL = function() {
        if(settings.YouTubeID === "") {
            return "";
        }
        var yturl = "https://gdata.youtube.com/feeds/api/users/"+ settings.YouTubeID +"/newsubscriptionvideos?alt=json&max-results=50";
        return yturl;
    },

    getDmURL = function() {
        if(settings.DailyMotionID === "") {
            return "";
        }
        var dmurl =  "https://api.dailymotion.com/user/" + settings.DailyMotionID +"/subscriptions?fields=created_time,id,owner.username%2Cthumbnail_180_url%2Ctitle%2Curl&sort=recent&limit=100";
        return dmurl;
    };


    return {
        Init: Init,
        Load: Load,
        Hide: Hide,
        loadDmChannels: loadDmChannels,
        loadYtChannels: loadYtChannels,
        loadYtChannelsv3: loadYtChannelsv3,
        loadViChannels: loadViChannels,
        getViURL: getViURL,
        getYtURL: getYtURL,
        getDmURL: getDmURL,
        settings: settings,
        SaveSettings: SaveSettings
    };
}();