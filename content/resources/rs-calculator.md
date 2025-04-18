+++
title = 'Random Seed Calculator'
summary = 'Know where to place sand, and also to know when to load the sand'
tags = ["practice", "service"]
+++

<noscript>
 For the calculator to work it is necessary to enable JavaScript.
 Here are the [instructions how to enable JavaScript in your web browser](https://www.enable-javascript.com/).
</noscript>
From To is Spawn Chunk

The first 4 are just straight line directions (you have to go to those
coordinates or further to unload the falling block when you die)

The last 4 are diagonal coordinates (you have to go to those coordinates
or further to unload the falling block when u die)

<form class="rs-calc mcbe-stack" data-size="4" data-direction="column">
    <label class="ds-label">
        Spawn X:
        <input type="number" name="spawn-x" class="ds-input" />
    </label>
    <label class="ds-label">
        Spawn Z:
        <input type="number" name="spawn-z" class="ds-input" />
    </label>
    <button type="submit" class="ds-button">
        Calculate
    </button>
</form>
<script defer src="../../rs-calc.js"></script>
