# cubepartyinvite.github.io
Relatively Simple way to participate to [Cubeparty](https://github.com/cubeparty/cubeparty.github.io). See [link](https://github.com/cubeparty/cubeparty.github.io) for further information.

Party invite framework includes always needful loading animation that spins while loading resourses such as audio. There are also couple basic effects added. Framework uses heavily GSAP timeline for animating components inside an effects. Graphics library is threejs which uses webgl rendering. Audio library is Soundmanager2.

# How it works
Loading semaphore: Global mutex _loadingOn_ controls whether the loading animation is in progres. Variable is set by Loading Manager. Loading manager increases internal sempahore count on every .itemStart(id) request and decreases count on .itemEnd(id). After all resources all loaded the Loading Manager calls onLoad callback which set _loadingOn_ mutex to false. Loading animation polls the change on every revoltion and loading is finished loading animation calls the onCompleted callback provded by constructor. _startShow_ enables the music and starts the control timeline which is used to control each action separately.

Timeline support hierarcial timelines but this version uses explicit timeline control with callbacks to start and stop timelines embedded in actions. Action can be very simple operation from state change to hierarcial timelines controlling multiple scenes.

# How to use
fork & modify

Create function based on knot.js, load it on html and push to effects with _enabled_ flag set true. Modify the control timeline to fit your needs.

TBD more configuration options so that forking/stabbing would not be needed. CubeParty html file is the main configuration point for own productions. Add you own scripts to be loaded and modify the createCubeParty function to include your own actions and timings. Master branch is the development edge and doesn't give guarantees to backwards compatibility. There are tags that provide more stable release candidates. Minor version number means that there are changes which probably breaks the compatibility and needs merging. Patch number should be quite small fix and hopefully doesn't break anything bigger.

# tl;dr;
So alpha, very edge. wow.
Major release number increases when quality and design reaches stable point.

Have Fun.

Distributed under CC-BY-NC-SA license (c) 2015 by Anssi Eteläniemi, aetelani(a)live.com 
