+++
title = 'Timing'
summary = 'How to time a run'
tags = ["retime"]
+++

The most common task for every moderator is examining runs. Aside from
the general checks, every run SHOULD be retimed. Runners are not
expected to retime runs themselves, nor are they to be trusted in
timing.

A run's final time can vary by many factors, such as upload compression
and general position of the stars, as such some lean way is to be
expected in the final time. Full runs are to be timed to the nearest
second, and Individual Level runs are to be timed to the millisecond.

retime.mcbe.wtf
---------------

[Speedrun Retimer](https://retime.mcbe.wtf/) is a self hosted fork
commonly used by moderators from various communities to retime runs. It
works on youtube and google drive videos without the need to download
them first.

Youtube Manual
--------------

Guide originally authored by Mango Man:

```
Some people time in their editors but I just do it in youtube
so if the video isnt on youtube I just upload it there unlisted
using , and . you can move 1 frame backwards and forwards in the video
so what I do is I find the start point of the video, and I frame advance to the next second
and I write down both the amount of frames that was, and what the next second is
so for example lets say the start point is somewhere in 0:08.xxx
I frame advance until 0:09 and write down the number of frames that took (for example, 5 frames) and I write down 0:09
then I go to the end of the run
and you find the moment the run ends
you write down the full second the run ends, for example, 2:15
and then I find how many frames are between 2:15 and the last frame of the run (for example, 6 frames)
then by right clicking the video on youtube and selecting stats for nerds you can see some important info
specifically, you will see something like this:Current / Optimal Res 1920x1080@30 / 1920x1080@30
see where it says @30?
that means its 30fps
so now we have 5 frames, 0:09, 2:15, and 6 frames written down
so its just maths
2:15 - 0:09 = 2:06
and to find the miliseconds you do frames/framerate
so the total frames left are 11 and the video is 30fps
so its 11/30 or 0.36666 recurring
so the end run time is 2:06.367
if its a full game run, we dont use miliseconds so its just 2:06
if its an IL, we use 2 decimals so its 2:06.370
```

Avidemux
--------

[Avidemux](http://fixounet.free.fr/avidemux/) is a general purpose video
editor used by old people to retime runs. To use this you must first
download the video. This is often done with tools such as `yt-dlp` and
`youtube-dl`.

1. Open up your video
    - From a terminal on voidlinux run `xbps-install avidemux &&
      avidemux3_qt5 $FILE.mp4`
2. Move the cursor to the start time based on the category's rules
3. Mark the start by pressing the icon that looks like a black A with a
   red background
4. Move the cursor to the end time based on the category's rules
5. Mark the end by pressing the icon that looks like a black B with a
   white background, next to the previous button
6. In the bottom right corner there will be the final time marked as
   "Selection: %Hours:%Minutes:%Seconds.%Milliseconds"

To analyse further the LEFT and RIGHT buttons can be used to go frame by
frame. Holding right can make the video play at full speed, and letting
go will stop the video. This does not work quite as well when going
backwards.

Honourable mentions
-------------------

- [mk8dx-speedrun-timer](https://mk8dx-speedrun-timer.azurewebsites.net/)
    * A timer made by the mario kart 8 deluxe moderation team, which can
      handle timing youtube videos and twitch vods without downloading
      them.
- [Youtube-Frame-Timer-Extension](https://github.com/ravsil/Youtube-Frame-Timer-Extension)
    * An "Extension" that can be used to retime runs directly from
      speedrun.com or youtube.com without leaving the site.
