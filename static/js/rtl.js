// http://stackoverflow.com/questions/4330951/how-to-detect-whether-a-character-belongs-to-a-right-to-left-language
function isRTL(c) {
    if(c >= 0x5BE && c <= 0x10B7F)
    {
        if(c <= 0x85E)
        {
            if(c == 0x5BE)                        return 1;
            else if(c == 0x5C0)                   return 1;
            else if(c == 0x5C3)                   return 1;
            else if(c == 0x5C6)                   return 1;
            else if(0x5D0 <= c && c <= 0x5EA)     return 1;
            else if(0x5F0 <= c && c <= 0x5F4)     return 1;
            else if(c == 0x608)                   return 1;
            else if(c == 0x60B)                   return 1;
            else if(c == 0x60D)                   return 1;
            else if(c == 0x61B)                   return 1;
            else if(0x61E <= c && c <= 0x64A)     return 1;
            else if(0x66D <= c && c <= 0x66F)     return 1;
            else if(0x671 <= c && c <= 0x6D5)     return 1;
            else if(0x6E5 <= c && c <= 0x6E6)     return 1;
            else if(0x6EE <= c && c <= 0x6EF)     return 1;
            else if(0x6FA <= c && c <= 0x70D)     return 1;
            else if(c == 0x710)                   return 1;
            else if(0x712 <= c && c <= 0x72F)     return 1;
            else if(0x74D <= c && c <= 0x7A5)     return 1;
            else if(c == 0x7B1)                   return 1;
            else if(0x7C0 <= c && c <= 0x7EA)     return 1;
            else if(0x7F4 <= c && c <= 0x7F5)     return 1;
            else if(c == 0x7FA)                   return 1;
            else if(0x800 <= c && c <= 0x815)     return 1;
            else if(c == 0x81A)                   return 1;
            else if(c == 0x824)                   return 1;
            else if(c == 0x828)                   return 1;
            else if(0x830 <= c && c <= 0x83E)     return 1;
            else if(0x840 <= c && c <= 0x858)     return 1;
            else if(c == 0x85E)                   return 1;
        }
        else if(c == 0x200F)                      return 1;
        else if(c >= 0xFB1D)
        {
            if(c == 0xFB1D)                       return 1;
            else if(0xFB1F <= c && c <= 0xFB28)   return 1;
            else if(0xFB2A <= c && c <= 0xFB36)   return 1;
            else if(0xFB38 <= c && c <= 0xFB3C)   return 1;
            else if(c == 0xFB3E)                  return 1;
            else if(0xFB40 <= c && c <= 0xFB41)   return 1;
            else if(0xFB43 <= c && c <= 0xFB44)   return 1;
            else if(0xFB46 <= c && c <= 0xFBC1)   return 1;
            else if(0xFBD3 <= c && c <= 0xFD3D)   return 1;
            else if(0xFD50 <= c && c <= 0xFD8F)   return 1;
            else if(0xFD92 <= c && c <= 0xFDC7)   return 1;
            else if(0xFDF0 <= c && c <= 0xFDFC)   return 1;
            else if(0xFE70 <= c && c <= 0xFE74)   return 1;
            else if(0xFE76 <= c && c <= 0xFEFC)   return 1;
            else if(0x10800 <= c && c <= 0x10805) return 1;
            else if(c == 0x10808)                 return 1;
            else if(0x1080A <= c && c <= 0x10835) return 1;
            else if(0x10837 <= c && c <= 0x10838) return 1;
            else if(c == 0x1083C)                 return 1;
            else if(0x1083F <= c && c <= 0x10855) return 1;
            else if(0x10857 <= c && c <= 0x1085F) return 1;
            else if(0x10900 <= c && c <= 0x1091B) return 1;
            else if(0x10920 <= c && c <= 0x10939) return 1;
            else if(c == 0x1093F)                 return 1;
            else if(c == 0x10A00)                 return 1;
            else if(0x10A10 <= c && c <= 0x10A13) return 1;
            else if(0x10A15 <= c && c <= 0x10A17) return 1;
            else if(0x10A19 <= c && c <= 0x10A33) return 1;
            else if(0x10A40 <= c && c <= 0x10A47) return 1;
            else if(0x10A50 <= c && c <= 0x10A58) return 1;
            else if(0x10A60 <= c && c <= 0x10A7F) return 1;
            else if(0x10B00 <= c && c <= 0x10B35) return 1;
            else if(0x10B40 <= c && c <= 0x10B55) return 1;
            else if(0x10B58 <= c && c <= 0x10B72) return 1;
            else if(0x10B78 <= c && c <= 0x10B7F) return 1;
        }
    }
}
