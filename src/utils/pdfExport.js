const money = (value) => `${Number(value || 0).toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
const dateText = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('hr-HR') : '—'
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export async function exportGaragePdf({ title, subtitle, rows, summary = [], filename = 'virtualna-garaza-izvjestaj.pdf' }) {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import('jspdf'), import('html2canvas')])
  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff;color:#172338;font-family:Arial,sans-serif;z-index:-1;box-sizing:border-box;padding:45px;'
  const totals = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  const categories = [...rows.reduce((map, row) => {
    const key = String(row.category || 'Ostalo')
    map.set(key, (map.get(key) || 0) + (Number(row.amount) || 0))
    return map
  }, new Map()).entries()].sort((a, b) => b[1] - a[1])
  wrapper.innerHTML = `<div style="border-bottom:3px solid #14b8a6;padding-bottom:20px;margin-bottom:24px"><div style="font-size:12px;letter-spacing:3px;color:#0d9488;font-weight:bold">VIRTUALNA GARAŽA</div><h1 style="font-size:29px;margin:12px 0 8px">${escapeHtml(title)}</h1><div style="font-size:13px;color:#64748b">${escapeHtml(subtitle || '')}</div><div style="font-size:12px;color:#64748b;margin-top:8px">Izrađeno: ${dateText(new Date().toISOString())}</div></div><div style="display:flex;gap:12px;margin-bottom:24px"><div style="flex:1;background:#f1f5f9;padding:17px;border-radius:9px"><div style="font-size:12px;color:#64748b">Ukupno evidentirano</div><strong style="font-size:23px">${escapeHtml(money(totals))}</strong></div><div style="flex:1;background:#f1f5f9;padding:17px;border-radius:9px"><div style="font-size:12px;color:#64748b">Broj stavki</div><strong style="font-size:23px">${rows.length}</strong></div></div>${summary.length ? `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px">${summary.map(([label, value]) => `<div style="background:#f8fafc;padding:10px 14px;border-radius:7px"><span style="font-size:12px;color:#64748b">${escapeHtml(label)}: </span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>` : ''}<h2 style="font-size:17px;margin:20px 0 10px">Troškovi po kategorijama</h2><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="background:#e2e8f0"><th style="text-align:left;padding:9px">Kategorija</th><th style="text-align:right;padding:9px">Iznos</th></tr></thead><tbody>${categories.map(([name, value]) => `<tr><td style="padding:9px;border-bottom:1px solid #e2e8f0">${escapeHtml(name)}</td><td style="text-align:right;padding:9px;border-bottom:1px solid #e2e8f0">${escapeHtml(money(value))}</td></tr>`).join('')}</tbody></table><h2 style="font-size:17px;margin:26px 0 10px">Popis stavki</h2><table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="background:#e2e8f0"><th style="text-align:left;padding:8px">Datum</th><th style="text-align:left;padding:8px">Motocikl</th><th style="text-align:left;padding:8px">Opis / kategorija</th><th style="text-align:right;padding:8px">Iznos</th></tr></thead><tbody>${rows.map((row) => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(dateText(row.date))}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(row.vehicle || '')}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(row.description || row.category || '')}</td><td style="text-align:right;padding:8px;border-bottom:1px solid #e2e8f0;white-space:nowrap">${escapeHtml(money(row.amount))}</td></tr>`).join('')}</tbody></table><p style="font-size:11px;color:#64748b;margin-top:24px">Izvještaj sadrži podatke evidentirane u aplikaciji. Kupovna cijena motocikla nije uključena.</p>`
  document.body.appendChild(wrapper)
  try {
    await document.fonts.ready
    const canvas = await html2canvas(wrapper, { scale: 1.5, backgroundColor: '#ffffff', logging: false, useCORS: true })
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = 210
    const pageHeight = 297
    const margin = 12
    const imageWidth = pageWidth - margin * 2
    const pagePixels = Math.floor((pageHeight - margin * 2) * canvas.width / imageWidth)
    let offset = 0
    let page = 0
    while (offset < canvas.height) {
      const slice = document.createElement('canvas')
      slice.width = canvas.width
      slice.height = Math.min(pagePixels, canvas.height - offset)
      slice.getContext('2d').drawImage(canvas, 0, offset, canvas.width, slice.height, 0, 0, canvas.width, slice.height)
      if (page > 0) pdf.addPage()
      pdf.addImage(slice.toDataURL('image/jpeg', 0.94), 'JPEG', margin, margin, imageWidth, slice.height * imageWidth / canvas.width)
      offset += slice.height
      page += 1
    }
    pdf.save(filename)
  } finally {
    wrapper.remove()
  }
}
