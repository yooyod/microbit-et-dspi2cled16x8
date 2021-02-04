// tests go here; this will not be compiled when this package is used as an extension.

DSP_I2C16x8.Init_I2C_Addr(112)
basic.forever(function () {
    DSP_I2C16x8.PrintTxt("Hi!ETT")
    DSP_I2C16x8.PrintArrow(DSP_I2C16x8.Pr_Arrow.ScrL)
    DSP_I2C16x8.PrintNumbe(15)
})
