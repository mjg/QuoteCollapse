/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Contributor(s): Michael J Gruber  http://quotecollapse.mozdev.org/
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


var QuoteCollapse = {
//  _URIFixup : Components.classes["@mozilla.org/docshell/urifixup;1"].getService(Components.interfaces.nsIURIFixup),
//  _pref : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch(null),


  // Taken from LinkVisitor.
  // This function is invoked in window (?) context,
  // so use 'QuoteCollapse' instead of 'this'.
  // event.originalTarget is the loaded document.

  messagePane : null,

  onMailWindowLoad : function(event) {
    QuoteCollapse._messagePane = document.getElementById('messagepane'); // browser parenting the document
    // messagePane.addEventListener("click", QuoteCollapse._onClick, false); // cpould also reg. on doc
    QuoteCollapse._messagePane.addEventListener("load", QuoteCollapse._onLoad, true); // wait for doc to be loaded
  },

 // this is called when loading the document; time to insert style
  _onLoad: function(event) {
    var messageDocument = QuoteCollapse._messagePane.contentDocument; 
    if( ! messageDocument.getElementsByTagName("blockquote").item(0) ) return; // nothing to be done
    messageDocument.addEventListener("click", QuoteCollapse._onClick, false);
    messageDocument.getElementsByTagName("body").item(0).className='mailview';

    //the following is inspired by code from quotecolors
    var StyleElement = messageDocument.createElement("style");
    StyleElement.type = "text/css";
    var stylecontent='\
BODY.mailview blockquote[type="cite"] {\n\
 background: url("chrome://global/skin/tree/twisty-clsd.png") no-repeat top left;\n\
 height: 2ex;\n\
 padding-bottom: 0px;\n\
 overflow: -moz-hidden-unscrollable;\n\
}\n\
\n\
BODY.mailview blockquote[type="cite"].qctoggled {\n\
 background: url("chrome://global/skin/tree/twisty-open.png") no-repeat top left;\n\
 height: auto;\n\
 overflow: visible;\n\
}\n\
';
    var styletext = document.createTextNode(stylecontent);
    StyleElement.appendChild(styletext);
    messageDocument.getElementsByTagName("head")[0].appendChild(StyleElement);
  },

 // this is called by a click event
  _onClick: function(event) {
    var target = event.target;
    if(target.nodeName == 'PRE')
      target = target.parentNode; // PRE inside; don't handle recursively
    if(target.nodeName != 'BLOCKQUOTE')
      return;

    if(target.className=='')
      target.className='qctoggled';
    else
      target.className='';
    return true;
  },



};

// register listener so that we can update the popup
// This is done from the corresponding xul 
// window.addEventListener("load", QuoteCollapse.onWindowLoad, true);
