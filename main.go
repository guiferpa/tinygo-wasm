package main

import "unsafe"

func main() {}

//export applyBlackAndWhiteFilter
func applyBlackAndWhiteFilter(p *uintptr, size int) {
	up := uintptr(unsafe.Pointer(p))

	i := 0
	for i < size {
		ap0 := (*byte)(unsafe.Pointer(up + uintptr(i+0)))
		ap1 := (*byte)(unsafe.Pointer(up + uintptr(i+1)))
		ap2 := (*byte)(unsafe.Pointer(up + uintptr(i+2)))

		filter := (*ap0 / 3) + (*ap1 / 3) + (*ap2 / 3)

		*ap0 = filter
		*ap1 = filter
		*ap2 = filter

		i += 4
	}

}
