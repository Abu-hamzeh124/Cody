import logo from '../assets/logo.png'

export default function LogoBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72].map((row) => (
        <div
          key={row}
          className="flex whitespace-nowrap"
          style={{
            animation: `scroll ${row % 2 === 0 ? '20s' : '25s'} linear infinite`,
            transform: `rotate(-170deg)`,
            marginTop: '-140px',
          }}
        >
          {Array(20).fill(null).map((_, i) => (
            <img key={i} src={logo} className="h-48 mx-1 inline-block" />
          ))}
          {Array(20).fill(null).map((_, i) => (
            <img key={`dup-${i}`} src={logo} className="h-48 mx-1 inline-block" />
          ))}
        </div>
      ))}
    </div>
  )
}