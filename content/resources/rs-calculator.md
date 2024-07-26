+++
title = 'Random Seed Calculator'
summary = 'Know where to place sand, and also to know when to load the sand'
+++

<script defer src="../../rs-calc.js"></script>
<noscript>
 For the calculator to work it is necessary to enable JavaScript.
 Here are the <a href="https://www.enable-javascript.com/">
 instructions how to enable JavaScript in your web browser</a>.
</noscript>
From To is Spawn Chunk

The first 4 are just straight line directions (you have to go to those
coordinates or further to unload the falling block when you die)

The last 4 are diagonal coodinates (you have to go those coordinates or
further to unload the falling block when u die)

<form class="rs-calc">
    <label>
        Spawn X:
        <input type="number" name="spawn-x" />
    </label>
    <label>
        Spawn Z:
        <input type="number" name="spawn-z" />
    </label>
    <button type="submit">
        Calculate
    </button>

<details>
    <summary>Results</summary>
    From X: <span class="spawnX"></span>
    From Z: <span class="spawnZ"></span>
    To X: <span class="spawnToX"></span>
    To Z: <span class="spawnToZ"></span>
    <br />
    <br />
    Positive X: <span class="positiveX"></span>
    Positive Z: <span class="positiveZ"></span>
    <br />
    Negative X: <span class="negativeX"></span>
    Negative Z: <span class="negativeZ"></span>
    <br />
    PosX PosZ: X: <span class="midPositiveX"></span> Z: <span class="midPositiveZ"></span>
    <br />
    PosX NegZ: X: <span class="midPositiveX"></span> Z: <span class="midNegativeZ"></span>
    <br />
    NegX NegZ: X: <span class="midNegativeX"></span> Z: <span class="midNegativeZ"></span>
    <br />
    NegX PosZ: X: <span class="midNegativeX"></span> Z: <span class="midPositiveZ"></span>
</details>
</form>
