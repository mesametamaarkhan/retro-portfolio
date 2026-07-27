'use client';

export function Scanlines() {
  return (
    <>
      <div className="crt-scanlines crt-vignette" aria-hidden />
      <div
        className="boot-noise pointer-events-none fixed inset-0 z-[60] bg-crt-bg"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.5%22/></svg>")',
        }}
        aria-hidden
      />
    </>
  );
}
