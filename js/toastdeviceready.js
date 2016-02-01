var phonegapReady = function(){
                    new $.nd2Toast({message:"we are in phonegap"});
                };
                document.addEventListener("deviceready", phonegapReady, false);
