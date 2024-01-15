package main

import "unsafe"

func main() {}

//export applyBlackAndWhiteFilter
func applyBlackAndWhiteFilter(p *int, size int) {
	up := uintptr(unsafe.Pointer(p))

	i := 0
	for i < size {
		ap0 := (*byte)(unsafe.Pointer(up + uintptr(i+0)))
		ap1 := (*byte)(unsafe.Pointer(up + uintptr(i+1)))
		ap2 := (*byte)(unsafe.Pointer(up + uintptr(i+2)))

		// filter := byte((uint16(*ap0) + uint16(*ap1) + uint16(*ap2)) / 3)
		filter := (*ap0 / 3) + (*ap1 / 3) + (*ap2 / 3)

		*ap0 = filter
		*ap1 = filter
		*ap2 = filter

		i += 3
	}

}

//export applyRedFilter
func applyRedFilter(p *int, size int) {
	up := uintptr(unsafe.Pointer(p))

	i := 0
	for i < size {
		ap1 := (*byte)(unsafe.Pointer(up + uintptr(i+1)))
		ap2 := (*byte)(unsafe.Pointer(up + uintptr(i+2)))
		ap5 := (*byte)(unsafe.Pointer(up + uintptr(i+5)))
		ap6 := (*byte)(unsafe.Pointer(up + uintptr(i+6)))

		*ap1 = (*ap1 / 2)
		*ap2 = (*ap2 / 2)
		*ap5 = (*ap5 / 2)
		*ap6 = (*ap6 / 2)

		i += 8
	}
}
