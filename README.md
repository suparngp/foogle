Foogle! Google Free Google...
===================

Google anonymously without getting tracked by ad cookies and other crap with this brand new interface. 
Includes INFINITE SCROLLING for search results. Clean, minimal UI, which you can customize any way you like.

What?
----
Tracking cookies, adware etc etc, we all know what they are and what they do. Ad Block and Ghostery work but still I have to turn on cookies in order to use Google Search.  I wanted some customizations in the search results for example, infinite scroll like DuckDuckGo (which btw is anonymous as well, however, the results suck most of the times). So I ended up writing a small express app which lets me browse Google in a clean way. It relays the request through a node proxy server which doesn't maintain any session info. So my assumption is, apart from my VPN's IP, there isn't any other info that can uniquely identify search requests.

Installation
----
1. Install NodeJS latest version
2. Clone the repo
3. Run `npm install`
4. Run `./bin/www`
5. Your Foogle search is now available at `localhost:3000`
6. You can change your default search engine in your browser preferences. The regex is `http://localhost:3000/search?query=%s`
7. You can also map something like `foogle.com` in your `/etc/hosts` to point this server


Screenshots
-------
![enter image description here](http://i.imgur.com/9dX01V9.png)
