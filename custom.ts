
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

enum MyEnum {
    //% block="one"
    One,
    //% block="two"
    Two
}

/*******************************************************************
 **                               Custom blocks                   **
 *******************************************************************/

//% weight=125 color="#00CF00" icon="\uf2a1"    

namespace DSP_I2C16x8
 {  
  //--------- Enum valiable----------------------   

   export enum DSP_Status 
   { 
    //% block="ON"
        ON,
     //% block="OFF"
        OFF
   }
 
  export enum DSP_Blink
   {
    //% block="OFF"
        OFF,
    //% block="Fast"
        Fast,
     //% block="Mid"
        Mid,
     //% block="Low"
        Low

   }
 
 export enum Pr_Arrow
   {
      
    //% block="Up"
        UP=0 ,
    //% block="Dw"
        DW=1,
    //% block="LF"
        LF=2,
    //% block="RT"
        RT=3,
    //% block="MD"
        MD=4,
    //% block="UpL"
        UL=5,
    //% block="UpR"
        UR=6,
    //% block="DwL"
        DL=7,
    //% block="DwR"
        DR=8,
    //% block="Scroll_L"
        ScrL=9,
    //% block="Scroll_R"
        ScrR=10

   }
//---------------------Define Command HT16K33 and Other ------------------

//-------- HT16K33 commands ---------
  const HT16K33_CMD_SYSTEM    = 0x20
  const HT16K33_CMD_DISPLAY   = 0x80
  const HT16K33_CMD_DIMMING   = 0xE0 
  
//------- Value Setup for Command ---
  const Osc_OFF      = 0x00
  const Osc_ON       = 0x01
  const DSP_OFF      = 0x00
  const DSP_ON       = 0x01
  const Blink_OFF    = 0x00
  const Blink_2H     = 0x02
  const Blink_1H     = 0x04
  const Blink_0H5    = 0x06

//--------------------- Gobal Valiabl --------------------------

    let _addr   :number       = 0x70  //default I2C Address(A=000)=112
    let _fagDSP :number       = 0
    let _fagBLK :number       = 0
    let _dtBuf  :number[]     = []

  //let _dspBuf     = []

/******************************************************************************************** 
 **                                           Sub CustomBox                                **
 ********************************************************************************************/

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                    Function Initial Display                        ++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    //% weight=8
    //% block="Setup DSP I2C Addr $addr"

    export function Init_I2C_Addr(addr:number)
    {   
        _addr = addr ;

        pins.i2cWriteNumber(_addr,HT16K33_CMD_SYSTEM |Osc_ON, NumberFormat.Int8LE,false) ;
        DSP_OnOFF(DSP_Status.ON )  ;
        Blink_OnOFF(DSP_Blink.OFF) ;
        Dimmer(15)                 ;
        Clr_DSP()                  ;
     
        
    }

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                           Function ON-OFF Display                             ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    //% weight=7
    //% block=" DSP ON-OFF:%val"
    //% val.defl=0
    //% interrupts.defl=false

    export function DSP_OnOFF(val:DSP_Status):void
    {  
        if(val == DSP_Status.ON )
        {
            pins.i2cWriteNumber(_addr, HT16K33_CMD_DISPLAY | DSP_ON | _fagBLK, NumberFormat.UInt8LE,false);
            _fagDSP = DSP_ON  ;
        }
        else if (val == DSP_Status.OFF )
        {
            pins.i2cWriteNumber(_addr, HT16K33_CMD_DISPLAY | DSP_OFF | _fagBLK , NumberFormat.UInt8LE,false) ;
            _fagDSP = DSP_OFF  ;
        }
    }


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                           Function Blink Display                            ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    //% weight=6
    //% block=" DSP BLINK:%val"
    //% val.defl=0
    //% interrupts.defl=false

    export function Blink_OnOFF(val:DSP_Blink):void
    {  
        
        if(val == DSP_Blink.OFF )
        {
            pins.i2cWriteNumber(_addr, HT16K33_CMD_DISPLAY | Blink_OFF| _fagDSP, NumberFormat.UInt8LE,false);
            _fagBLK = Blink_OFF ;
        }
        else if (val == DSP_Blink.Fast )
        {
            pins.i2cWriteNumber(_addr, HT16K33_CMD_DISPLAY | Blink_2H | _fagDSP, NumberFormat.UInt8LE,false) ;
            _fagBLK = Blink_2H ;
        }
        else if (val == DSP_Blink.Mid )
        { 
            pins.i2cWriteNumber(_addr, HT16K33_CMD_DISPLAY | Blink_1H | _fagDSP, NumberFormat.UInt8LE,false) ;
            _fagBLK = Blink_1H ;
        }
        else if (val == DSP_Blink.Low )
        { 
            pins.i2cWriteNumber(_addr, HT16K33_CMD_DISPLAY | Blink_0H5 | _fagDSP, NumberFormat.UInt8LE,false) ;
            _fagBLK = Blink_0H5 ;
        }
    }

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                         Function Dimmer Display                             ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    //% weight=5
    //% block="DSP Brightness[0-15]: $val"

    export function Dimmer(val:number)
    {   
        if(val<16)
        {
           pins.i2cWriteNumber(_addr,HT16K33_CMD_DIMMING|val, NumberFormat.UInt8LE,false) ;
        }
    }

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                    Function Clear data Buffer of display All                 ++
  ++                                                                              ++             
  ++        bg = Value Clear display buffer 0 or 1                                ++
  ++             0 : Clear Data Buffer display all =0 (OFF LED All)               ++
  ++             1 : Clear Data Buffer display all = 0xFF(ON LED All)             ++ 
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
 
    function Clr_dtbuf(bg :number):void
    {
        let nb ;

        if(bg == 0)
            bg = 0     ;
        else 
            bg = 0xFF  ;
  
    for( nb = 0 ; nb < 8; nb++)
     {
       _dtBuf[nb]   = bg;  //Write data to buffer array 0-7  for Colum(0-7) address even   
       _dtBuf[nb+8] = bg;  //Write data to buffer array 8-15 for Colum(8-15) address odd  
     }
           
    }


/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                    Function Clear display                                    ++       
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
 
  //% weight=4
  //% block="Clear Display"

    export function Clr_DSP():void
    {
        let nb ;

        for( nb = 0 ; nb < 8; nb++)
        {
            _dtBuf[nb]   = 0;  //Write data to buffer array 0-7  for Colum(0-7) address even   
            _dtBuf[nb+8] = 0;  //Write data to buffer array 8-15 for Colum(8-15) address odd  
        }
        Update_DSP()         ;
           
    }


 /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   ++                   Function Update Display All                   ++
   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    function Update_DSP() :void
    {
        let k=0 ; 
        let n=0   ;

        let dspbuf  = pins.createBuffer(17);

        dspbuf[0] = 0 ; //Buf0 keep Address Start


        for(n=1;n<17;n=n+2)   //Data Buf 1 to 16  keep Data DSP
        {       
            dspbuf[n]   = _dtBuf[k]   ;
            dspbuf[n+1] = _dtBuf[k+8] ;
          
            k++ ;
        }
   

         pins.i2cWriteBuffer(_addr,dspbuf,false); //Sent stop bit when end data
       
       // basic.pause(100)                  ;
    }




/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++              Function:Printer Number                                ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++       Input :                                                       ++
  ++                  num = Decimal Number 0-9  ไม่เกิน 8 หลัก              ++
  ++                                                                     ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

 //% weight=3 
 //% block="Print Number $num" blockGap=8
 
    export function PrintNumber(num: number) :void
    {
      PrintTxt(Math.roundWithPrecision(num,2).toString());
    }



/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++          Function:Plot Text Ascii 1 Charecter to Buffer             ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++       Input :                                                       ++
  ++                  txt = Ascii Charecter (0x20-0x7F)                  ++
  ++                                                                     ++
  ++                   px = Position colum Start plot Char 0-15          ++
  ++                                                                     ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

 
    function  CharToDtbuf(txt:string, px:number):void
    {
        let row,col,ft ;
        let tx =0      ;
      

        let index = Tab_Font.indexOf(txt.substr(0,1),0) //นำตัวอักษรตำแหน่ง 0 1 ตัวที่รับเข้ามา เทียบหาว่าตรงกับตำแหน่งอักษรใดในตาราง Ascii
        
        //-----Set wide Font ------   
        ft = 5 ;                                //Select font 5x7  ft= wide Byte :5 Byte
 
        for(col=0;col<ft;col++)                  //Loop Number Byte Charecter in 1 Row Array (wide charecter)
        {
            tx = font_5x7[index][col]        ;   //Read data font Charecter 5x7 
            _dtBuf[px]  = tx  ;                 //keep data to display buffer
            px++               ;                 //increment array display buffer
        }

    }  //print char


 
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++              Function:Scroll Text                                   ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++       Input :                                                       ++
  ++                  txt = Strinh=g Charecter                           ++
  ++                                                                     ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


    function ScrollTxt(txt:string):void
    {
        let row,col,ft,k;
        let tx = 0           
 
        
        let index = Tab_Font.indexOf(txt.substr(0,1)) //นำตัวอักษรตำแหน่ง 0 1 ตัวที่รับเข้ามา เทียบหาว่าตรงกับตำแหน่งอักษรใดในตาราง Ascii
        
     //-----Set wide Font ------   
        if(index==0)
          ft = 2 ;   //space 3 dot
        else
         ft = 5 ;                                            //Select font 5x7  ft= wide Byte :5 Byte

        for(col=0;col<=ft;col++)                             //Loop Number Byte Charecter in 1 Row Array (wide charecter)
        {
            tx = font_5x7[index][col]        ;               //Read data font Charecter 5x7        
           
            for(k=0;k<15;k++)                                //Shift data in display buffer from buf[15]---> buf[0]
            {
                _dtBuf[k]  =  _dtBuf[k+1]   ;                 
            }

            if(col==ft)                                      //เว้นวรรค 1 colum เมื่อจบ 1 ตัวอักษร
                tx=0 ;
       
            _dtBuf[15]  = tx                 ;              //keep data to display buffer[15] 
            
            Update_DSP()                     ;        
            basic.pause(120)                 ; 
            
        }

 }


 /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   ++                    Function:Print String                           ++
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   ++                                                                    ++
   ++      Input  :                                                      ++
   ++               txt = String                                         ++
   ++                                                                    ++ 
   ++                                                                    ++
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

 //% weight=2 
 //% block="Print Text $txt" 
 //% txt.defl="Hi!ETT" 

    export function PrintTxt(txt:string):void
    {
        let i,num,k,cr ;

        num = txt.length           ;    //Read Leng of String
 
      
       
    
        if(num ==1)
        {
            Clr_dtbuf(0)           ;    // Clear data Buffer All
            CharToDtbuf(txt[0],6)  ;    // Keep String 1 Charector to Buffer
            Update_DSP()           ;    //Print data to display All
            basic.pause(750)       ;
       
        }  
  //--------------------------------------  
  
        if(num == 2) 
        {   
            Clr_dtbuf(0)           ;    // Clear data Buffer All
            CharToDtbuf(txt[0],2)  ;    //Keep String 1 Charector to Buffer
            CharToDtbuf(txt[1],8)  ; 
            Update_DSP()           ;    //Print data to display All
            basic.pause(750)       ;
           
        }
  //------------------------------------   
  
        if(num > 2) 
        {
      
            for (i=0;i<num;i++)
            {          
                 
                 ScrollTxt(txt[i])   ;
            }   
          //------------------------------

            for(cr=0; cr<24;cr++)                  //Loop shift clear display space when end last string
            {
               
                for(k=0;k<15;k++)                 //Shift data in display buffer from buf[15]---> buf[0]
                {
                    _dtBuf[k]  =  _dtBuf[k+1]   ;                 
                }
               _dtBuf[15] = 0                   ; //Clear data buffer = 0

                 Update_DSP()                   ;
                 basic.pause(120)               ;
      
            }    //for    
        }

}//void

 

/********************************************************
 *                Function :Print Arrow                 *
 ********************************************************                    
 *  Draws an arrow on the LED screen                    *
 *  @param aw the direction of the arrow 0-10           *
 * time (milliseconds) to show the icon. Default is 600 *
 *                                                      *
 ********************************************************/
 
    //% weight=1 blockGap=8
    //% block="Print Arrow: %aw"
 
    export function PrintArrow(aw:Pr_Arrow):void
     {
         let direc=255 ;
         let k,col,daw,px=4 ;
    
         switch (aw) 
            {
                case Pr_Arrow.UP : 
                                    direc = 0  ;  //Index Row Array code of Arrow Up 

                                    break ;

                case Pr_Arrow.DW : 
                                    direc = 1  ;   //Index Row Array code of Arrow Down 

                                    break ;

                 case Pr_Arrow.LF: 
                                    direc = 2  ;  //Index Row Array code of  Arrow Left 

                                    break ;

                case Pr_Arrow.RT: 
                                    direc = 3  ;  //Index Row Array code of Arrow Right 

                                    break ;
                                    
                case Pr_Arrow.MD : 
                                    direc = 4  ;  //Index Row Array code of Arrow Center 

                                    break ;

                case Pr_Arrow.UL : 
                                    direc = 5  ;  //Index Row Array code of Arrow UP-Left

                                    break ;

                 case Pr_Arrow.UR: 
                                    direc = 6  ;  //Index Row Array code of Arrow UP-Right

                                    break ;

                case Pr_Arrow.DL: 
                                    direc = 7  ;   //Index Row Array code of Arrow Down-Left

                                    break ;
   
                case Pr_Arrow.DR: 
                                    direc = 8;    //Index Row Array code of Arrow Down-Right

                                    break ;

                case Pr_Arrow.ScrL: 
                                    direc = 2;   //Index Row Array code of  Arrow Left 

                                    break ;

                case Pr_Arrow.ScrR: 
                                    direc = 2;   //Index Row Array code of  Arrow Left 

                                    break ;


            }
        
        if((aw==Pr_Arrow.ScrL)||(aw==Pr_Arrow.ScrR))  //Show Arrow Scroll for Left and Rigjt 
        { 
           if(aw == Pr_Arrow.ScrL)                                  //Loop Arrow Scroll Left
            { 
                for(col=0;col<24;col++)                             //Loop Shift Colum 0-23 and Index positon data Arrow array[0-7]
                {
                    for(k=0;k<15;k++)                               //Shift data in data-buffer from buf[k+1]---> buf[k] buf 15-0
                        _dtBuf[k]  =  _dtBuf[k+1]   ;   

                    daw = Sign_Arrow[direc][col]    ;               //Read data Arrow Left size 8x8 start colum[0]-[7]
                         
                    if(col>7)                                      //ถ้า data array > 7 Set data to  0 
                        daw=0 ;
       
                    _dtBuf[15]  = daw                ;              //keep data to data-buffer[15] 
            
                    Update_DSP()                     ;              // update DSP 
                    basic.pause(100)                 ; 

                } //for
            
            } // if aw ScrL
            else if(aw == Pr_Arrow.ScrR)                           //Loop Arrow Scroll Right
            { 
                for(col=0;col<24;col++)                            //Loop Shift Colum 0-23 and Index positon data Arrow array[0-7]
                {

                    for(k=14;k>=0;k--)                             //Shift data in data-buffer from buf[k]---> buf[k+1] buf 0-15
                        _dtBuf[k+1]  =  _dtBuf[k]    ;                 
                    
                    daw = Sign_Arrow[direc][col]     ;             //Read data Arrow Left size 8x8 start colum[0]-[7] 
           
                  
                    if(col>7)                                      //ถ้า data array > 7 Set data to  0 
                        daw=0 ;
       
                    _dtBuf[0]  = daw                 ;              //keep data to data-buffer[15] 
            
                    Update_DSP()                     ;              // update DSP 
                    basic.pause(100)                 ; 

                } //for
            
            } // else if aw ScrR

        } //if
        else   // Show Arrow Not Scroll
        {  
           Clr_dtbuf(0)                        ;    // Clear Display Buffer All

           for(col=0;col<8;col++)                  //Loop Number Byte Sign in 1 Row Array (wide Sign)
            {
                daw = Sign_Arrow[direc][col]  ;    //Read data Sign_Arrow 8x8
                _dtBuf[px]  = daw             ;    //keep data to data buffer start colum4 Center DSP
               px++                           ;    //increment array data buffer Position Plot Data
            }
            Update_DSP()                      ;
            basic.pause(600)                  ;
        }

    } //End Arrow



  //---------------- Arrow Sign8x8 --------------------------

const Sign_Arrow = [       //array [R=9]x[C=8]

  [0x10,0x30,0x7F,0xFF,0x7F,0x30,0x10,0x00], //Up 
  [0x08,0x0C,0xFE,0xFF,0xFE,0x0C,0x08,0x00], //Down 
  [0x10,0x38,0x7C,0xFE,0x38,0x38,0x38,0x38], //Left   
  [0x38,0x38,0x38,0x38,0xFE,0x7C,0x38,0x10], //Right
  [0x3C,0x42,0x99,0xBD,0xBD,0x99,0x42,0x3C], //Stop        0x3c42 99bd bd99 423c
  [0xFE,0xFC,0xF8,0xFC,0xFE,0xDF,0x8E,0x04], //UP-Left     0x048e dffe fcf8 fcfe
  [0x04,0x8E,0xDF,0xFE,0xFC,0xF8,0xFC,0xFE], //UP-Right    0xfefc f8fc fedf 8e04 
  [0x7F,0x3F,0x1F,0x3F,0x7F,0xFB,0x71,0x20], //Down-Left   0x2071 fb7f 3f1f 3f7f
  [0x20,0x71,0xFB,0x7F,0x3F,0x1F,0x3F,0x7F], //Down-Right  0x7f3f 1f3f 7ffb 7120

  

]

  //---------------- ASCII fonts 8x8 --------------------------

const Tab_Font = [   //array[94]
" ", 
"!", 
"\"", 
"#", 
"$", 
"%", 
"&",
"\'",
"(",
")",
"*",
"+", 
",", 
"-",
".",
"/",
"0", 
"1", 
"2",
"3",
"4",
"5",
"6",
"7",                     
"8",
"9",
":",
";",
"<", 
"=",
">",
"?",
"@",
"A", 
"B", 
"C", 
"D", 
"E", 
"F", 
"G", 
"H", 
"I", 
"J", 
"K", 
"L",
"M",
"N",
"O",
"P",
"Q",
"R",
"S",
"T",
"U",
"V",
"W",
"X",
"Y",
"Z",
"[", 
"\\",
"]",
"^",
"_", 
"`",
"a",
"b",
"c",
"d",
"e",
"f",
"g",
"h",
"i",
"j",
"k",
"l",
"m",
"n",
"o",
"p",
"q",
"r",
"s",
"t",
"u",
"v",
"w",
"x",
"y",
"z",
"{",
"|",
"}",
"~"
 ]


/******************************************************
 *                                                    *
 *       Font 5x7(English)                            *
 *                                                    *
 ******************************************************
 * -ASCII fonts from 0x20 ~ 0x7F(DEC 32 ~ 127)        *
 *  composed of following characters                  *
 *                                                    * 
 * -XSize : 5  pixcels (Array 5byte 0-->4)            *
 * -YSize : 7  pixcels (Array 1 Byte)                 *
 *                                                    *
 *                                                    *
 *   End  ..OOOOO.. <- bit7       (y)                 *
 *    ^   ..OOOOO.. <- bit6        ^                  *
 *    |   ..OOOOO.. <- bit5        |                  *
 *    |   ..OOOOO.. <- bit4        |                  *
 *    |   ..OOOOO.. <- bit3        |                  *
 *    |   ..OOOOO.. <- bit2        |                  *
   Start  ..OOOOO.. <- bit1       +----->(x)          *                 
 *        ..OOOOO.. <- bit0  (Blank,Not Use)          *
 *                                                    *   
 *  Byte0-----------> Byte4                           *
 *                                                    *
 *     (O = 1 Byte Array  in Table)                   *
 *     (1 Charecter = 5 byte)                         *
 ******************************************************/

const font_5x7  = [                 //array [R=94]x[C=5]
        [0x00,0x00,0x00,0x00,0x00], //     
        [0x00,0x00,0xfa,0x00,0x00], // !   
        [0x00,0xe0,0x00,0xe0,0x00], // "   
        [0x28,0xfe,0x28,0xfe,0x28], // #   
        [0x24,0x54,0xfe,0x54,0x48], // $   
        [0xc4,0xc8,0x10,0x26,0x46], // %   
        [0x6c,0x92,0xaa,0x44,0x0a], // &   
        [0x00,0xa0,0xc0,0x00,0x00], // '   
        [0x00,0x38,0x44,0x82,0x00], // (   
        [0x00,0x82,0x44,0x38,0x00], // )   
        [0x10,0x54,0x38,0x54,0x10], // *
        [0x10,0x10,0x7c,0x10,0x10], // +
        [0x00,0x0a,0x0c,0x00,0x00], // ,
        [0x10,0x10,0x10,0x10,0x10], // -
        [0x00,0x06,0x06,0x00,0x00], // .
        [0x04,0x08,0x10,0x20,0x40], // /
        [0x7c,0x8a,0x92,0xa2,0x7c], // 0
        [0x22,0x42,0xfe,0x02,0x02], // 1
        [0x42,0x86,0x8a,0x92,0x62], // 2
        [0x84,0x82,0xa2,0xd2,0x8c], // 3
        [0x18,0x28,0x48,0xfe,0x08], // 4
        [0xe4,0xa2,0xa2,0xa2,0x9c], // 5
        [0x3c,0x52,0x92,0x92,0x0c], // 6
        [0x80,0x8e,0x90,0xa0,0xc0], // 7
        [0x6c,0x92,0x92,0x92,0x6c], // 8
        [0x60,0x92,0x92,0x94,0x78], // 9
        [0x00,0x6c,0x6c,0x00,0x00], // :
        [0x00,0x6a,0x6c,0x00,0x00], // ;
        [0x00,0x10,0x28,0x44,0x82], // <
        [0x28,0x28,0x28,0x28,0x28], // =
        [0x82,0x44,0x28,0x10,0x00], // >
        [0x40,0x80,0x8a,0x90,0x60], // ?
        [0x4c,0x92,0x9e,0x82,0x7c], // @
        [0x7e,0x88,0x88,0x88,0x7e], // A
        [0xfe,0x92,0x92,0x92,0x6c], // B
        [0x7c,0x82,0x82,0x82,0x44], // C
        [0xfe,0x82,0x82,0x44,0x38], // D
        [0xfe,0x92,0x92,0x92,0x82], // E
        [0xfe,0x90,0x90,0x80,0x80], // F
        [0x7c,0x82,0x82,0x8a,0x4c], // G
        [0xfe,0x10,0x10,0x10,0xfe], // H
        [0x00,0x82,0xfe,0x82,0x00], // I
        [0x04,0x02,0x82,0xfc,0x80], // J
        [0xfe,0x10,0x28,0x44,0x82], // K
        [0xfe,0x02,0x02,0x02,0x02], // L
        [0xfe,0x40,0x20,0x40,0xfe], // M
        [0xfe,0x20,0x10,0x08,0xfe], // N
        [0x7c,0x82,0x82,0x82,0x7c], // O
        [0xfe,0x90,0x90,0x90,0x60], // P
        [0x7c,0x82,0x8a,0x84,0x7a], // Q
        [0xfe,0x90,0x98,0x94,0x62], // R
        [0x62,0x92,0x92,0x92,0x8c], // S
        [0x80,0x80,0xfe,0x80,0x80], // T
        [0xfc,0x02,0x02,0x02,0xfc], // U
        [0xf8,0x04,0x02,0x04,0xf8], // V
        [0xfe,0x04,0x18,0x04,0xfe], // W
        [0xc6,0x28,0x10,0x28,0xc6], // X
        [0xc0,0x20,0x1e,0x20,0xc0], // Y
        [0x86,0x8a,0x92,0xa2,0xc2], // Z
        [0x00,0x00,0xfe,0x82,0x82], // [
        [0x40,0x20,0x10,0x08,0x04], // "\"
        [0x82,0x82,0xfe,0x00,0x00], // ]
        [0x20,0x40,0x80,0x40,0x20], // ^
        [0x02,0x02,0x02,0x02,0x02], // _
        [0x00,0x80,0x40,0x20,0x00], // `
        [0x04,0x2a,0x2a,0x2a,0x1e], // a
        [0xfe,0x12,0x22,0x22,0x1c], // b
        [0x1c,0x22,0x22,0x22,0x04], // c
        [0x1c,0x22,0x22,0x12,0xfe], // d
        [0x1c,0x2a,0x2a,0x2a,0x18], // e
        [0x10,0x7e,0x90,0x80,0x40], // f
        [0x10,0x28,0x2a,0x2a,0x3c], // g
        [0xfe,0x10,0x20,0x20,0x1e], // h
        [0x00,0x22,0xbe,0x02,0x00], // i
        [0x04,0x02,0x22,0xbc,0x00], // j
        [0x00,0xfe,0x08,0x14,0x22], // k
        [0x00,0x82,0xfe,0x02,0x00], // l
        [0x3e,0x20,0x18,0x20,0x1e], // m
        [0x3e,0x10,0x20,0x20,0x1e], // n
        [0x1c,0x22,0x22,0x22,0x1c], // o
        [0x3e,0x28,0x28,0x28,0x10], // p
        [0x10,0x28,0x28,0x18,0x3e], // q
        [0x3e,0x10,0x20,0x20,0x10], // r
        [0x12,0x2a,0x2a,0x2a,0x04], // s
        [0x20,0xfc,0x22,0x02,0x04], // t
        [0x3c,0x02,0x02,0x04,0x3e], // u
        [0x38,0x04,0x02,0x04,0x38], // v
        [0x3c,0x02,0x0c,0x02,0x3c], // w
        [0x22,0x14,0x08,0x14,0x22], // x
        [0x30,0x0a,0x0a,0x0a,0x3c], // y
        [0x22,0x26,0x2a,0x32,0x22], // z
        [0x00,0x10,0x6c,0x82,0x00], // {
        [0x00,0x00,0xfe,0x00,0x00], // |
        [0x00,0x82,0x6c,0x10,0x00], // }
        [0x40,0x80,0xc0,0x40,0x80]] // ~
        


} /*End Custom*/
