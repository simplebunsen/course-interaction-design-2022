# Interaction Design Basics / Grundlagen Interaktiver Gestaltung IA2
summer-term 2022</br>
University of Applied Sciences Augsburg, Faculty of Design, https://www.hs-augsburg.de/Gestaltung.html

teaching staff: Slawa Gurevich, Christoph Haag, Andreas Muxel, Silke Hilsing

* [Block I: Visuelle Systeme](https://github.com/HybridThingsLab/course-interaction-design-2022/tree/master/Block_I)
* [Block II: Interaktive Systeme](https://github.com/HybridThingsLab/course-interaction-design-2022/tree/master/Block_II)
* [Block III: Physische Systeme](https://github.com/HybridThingsLab/course-interaction-design-2022/tree/master/Block_III)

## Setup
In the end there are a thousand ways to code with p5.js - let's stick to the following toolchain to dive into our course so that it will be easier to support each other.

### Environment
Download and install Visual Studio Code (free), https://code.visualstudio.com

### P5.js Library
P5.js basically is Processing in a Browser.

We neatly packed this into the repository you will download in a later step.
More Details on P5.js:
* P5.js, https://p5js.org
* P5.js VS Processing, https://github.com/processing/p5.js/wiki/Processing-transition 
* Libraries, https://p5js.org/libraries/
* Learn, https://p5js.org/learn/

### Extensions for Visual Studio Code
In Visual Studio Code click the Button with the 4 squares "Extensions", search for and "Install" the extension.

* p5js Snippets
* JSON Tools
* Live Server
* Beautify
* Only if __REALLY__ needed: German Language Pack for Visual Studio Code

Tutorial on Extensions: https://www.youtube.com/watch?v=PmdbndOoKq4

### Browser
We strongly recommend Google Chrome, https://www.google.com/chrome/

How to set Chrome as your default browser for Live Server in Visual Studio Code:

* Install extension 'Live Server' (see instructions above)
* On Windows Go to File > Preferences > Settings
* On Mac Go to Code > Preferences > Settings
* Search for "browser"
* In settings "Live Server > Settings: Custom Browser" choose "Chrome"

### Code Repository
We packed a bunch of examples from this course as well together with the files needed for p5.js in a folder structure on GitHub. We will update this repository from time to time to correct bugs or add new examples. There are two ways to get all these files.

1. __BEGINNER__: Download the repository from the GitHub Website (https://github.com/HybridThingsLab/course-interaction-design-2022/archive/refs/heads/master.zip). Use button "Clone or Download" on the top right side of the page, download the ZIP and extract it.

2. __EXPERT__: In Visual Studio Code click the "Files" Icon, then "Clone Repository", paste the Repository URL https://github.com/HybridThingsLab/course-interaction-design-2022, hit Enter, create a folder for our files and select it as download location.
On Windows Machines you also need to install Git: https://git-scm.com/download/win

Whenever we will make a update to the repository, you can pull those changes to your local folder structure:

* Click the "Source Control" icon
* Click the three little dots above the file list
* Click "pull"

### Get going
* In Visual Studio Code click the "Files" Icon and navigate to "Block_I > p5js > examples > 01_clock_typo"

You will see some files but these are the most important:

1. `sketch.js`: Thats where you code
2. `index.html`: Thats where you can see your result

* Click `sketch.js` to open it in the code editor
* Right klick `index.html` > "Open with Live Server" to open it in your browser
* If asked, allow the html to access the internet

### Make it your code!
Please create your own code folder somewhere outside our code folder and copy one of the example folders over. You should not chage anythinig inside our code structure because it may interfere with future updates that we may do on the code if you use GIT (Collisions)

## The "Blocks"
We structured our course in three "Blocks", static, interactive and physical.

## Recommended tutorials
* beginner P5.js tutorials by Daniel Shiffmann on TheCodingTrain, https://thecodingtrain.com/beginners/p5js/
* Introduction p5.js: https://www.youtube.com/watch?v=8j0UDiN7my4
* Comparing p5.js and Processing (Daniel Shiffmann)
    * Part I: https://www.youtube.com/watch?v=AmlAiKsiy0o
    * Part II: https://www.youtube.com/watch?v=AsjPJ5AWkDc 

Note: in the tutorials another editor is used. But currently Shiffmann also uses Visual Studio Code.

## Further links

### Creative coding
* Book 'Generative Gestaltung', http://www.generative-gestaltung.de/2/
* Programming Design Systems by Rune Madsen, https://programmingdesignsystems.com
