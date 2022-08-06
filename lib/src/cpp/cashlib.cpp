#include <iostream>

#define SLAPI extern "C" __attribute__((visibility("default")))

SLAPI void sha256(const unsigned char *data, unsigned int len, unsigned char *result)
{
    std::cout << "\nSHA in the house!";
    // if (RAND_bytes(buf, num) != 1)
    // {
    //     memset(buf, 0, num);
    //     return 0;
    // }
    // return 112;
}

SLAPI int RandomBytes(unsigned char *buf, int num)
{
    // if (RAND_bytes(buf, num) != 1)
    // {
    //     memset(buf, 0, num);
    //     return 0;
    // }
    return 112;
}
