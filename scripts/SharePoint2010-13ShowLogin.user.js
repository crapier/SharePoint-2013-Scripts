// ==UserScript==
// @name         SharePoint 2010/13 Domain\User Shower
// @namespace    Rapier
// @version      1.0
// @description  SharePoint 2010/13 Show User Domain\User on addressbook and group lists with Ctrl+Z (Chrome, Tampermonkey)
// @author       Clifton Rapier
// @match        *://*/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    function copyInputText(e) {
        var copyText = e.target;
        copyText.select();
        document.execCommand("copy");
        e.preventDefault();
        e.stopPropagation();
    }

    function getUserById(id, success) {
        var context = new unsafeWindow.SP.ClientContext.get_current();
        var user = context.get_web().get_siteUsers().getById(id);
        context.load(user);
        context.executeQueryAsync(success.bind(user), null);
    }

    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 90 && e.ctrlKey) {
            var msAlt = document.querySelectorAll("tr.ms-alternating");
            var vbIcon = document.querySelectorAll("td.ms-vb-icon");
            var aLinks = document.querySelectorAll("a[href*='userdisp.aspx']");
            var lookupLists = document.querySelectorAll("input[name='PrincipalId']");


            if (document.querySelectorAll(".domainUserInput").length == 0) {
                msAlt.forEach(function(node){
                    var key = node.getAttribute("key");
                    if (key) {
                        key = key.substr(7);
                        var keyDiv = document.createElement("input");
                        keyDiv.classList.add("domainUserInput");
                        keyDiv.value = key;
                        keyDiv.addEventListener("click", copyInputText);
                        if (node.children[0] && node.children[0].children[1]) {
                            node.children[0].children[1].appendChild(keyDiv);
                        }
                    }
                });
                vbIcon.forEach(function(node){
                    if (node.children[0]) {
                        var account = node.children[0].getAttribute("account");
                        if (account) {
                            account = account.substr(7);
                            var accountDiv = document.createElement("input");
                            accountDiv.classList.add("domainUserInput");
                            accountDiv.value = account;
                            accountDiv.addEventListener("click", copyInputText);
                            node.appendChild(accountDiv);
                        }
                    }
                });
                aLinks.forEach(function(node){
                    if(node.innerHTML.indexOf("i:0#") >= 0) {
                        var account = node.innerHTML.substring(node.innerHTML.indexOf("i:0#") + 7, node.innerHTML.indexOf(")"));
                        var accountDiv = document.createElement("input");
                        accountDiv.classList.add("domainUserInput");
                        accountDiv.value = account;
                        accountDiv.addEventListener("click", copyInputText);
                        node.appendChild(accountDiv);
                    }
                });
                if (aLinks.length == 0) {
                    lookupLists.forEach(function(node){
                        if(node.parentElement.parentElement.children[2].children[0].value == "user") {
                            getUserById(node.value, function(){
                                var account = this.get_loginName();
                                account = account.substr(7);
                                var accountDiv = document.createElement("input");
                                accountDiv.classList.add("domainUserInput");
                                accountDiv.value = account;
                                accountDiv.addEventListener("click", copyInputText);
                                node.parentElement.appendChild(accountDiv);
                            });
                        }
                    });
                }
            }

            if (msAlt.length > 0 || vbIcon.length > 0 || aLinks.length > 0 || lookupLists.length > 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
})();
