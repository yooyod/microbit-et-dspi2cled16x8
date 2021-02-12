# Extention ET-DSP I2C LED 16x8 Library

> Open this page at [https://yooyod.github.io/microbit-et-dspi2cled16x8/](https://yooyod.github.io/microbit-et-dspi2cled16x8/)


## Usage

### DSP I2C 16x8

```blocks
DSP_I2C16x8.Init_I2C_Addr(112)
DSP_I2C16x8.Dimmer(15)
DSP_I2C16x8.DSP_OnOFF(DSP_I2C16x8.DSP_Status.ON)
DSP_I2C16x8.Blink_OnOFF(DSP_I2C16x8.DSP_Blink.OFF)
DSP_I2C16x8.Clr_DSP()


basic.forever(function () {
DSP_I2C16x8.PrintNumber(0)
DSP_I2C16x8.PrintTxt("Hi!ETT")
DSP_I2C16x8.PrintArrow(DSP_I2C16x8.Pr_Arrow.UP)
})
```

## Example

 Demo ET-DSP I2C LED 16x8 by I2C Address=112 defaule . Display Text,Arrow Shift Left and Fix number .

``` blocks 
DSP_I2C16x8.Init_I2C_Addr(112)

basic.forever(function () {
DSP_I2C16x8.PrintNumber(15)
DSP_I2C16x8.PrintTxt("Hi!ETT")
DSP_I2C16x8.PrintArrow(DSP_I2C16x8.Pr_Arrow.ScrL)

})
```

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/yooyod/microbit-et-dspi2cled16x8** and import

## Edit this project ![Build status badge](https://github.com/yooyod/microbit-et-dspi2cled16x8/workflows/MakeCode/badge.svg)

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/yooyod/microbit-et-dspi2cled16x8** and click import


#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
