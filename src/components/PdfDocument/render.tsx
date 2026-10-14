import { renderToBuffer } from '@react-pdf/renderer'
import type { PdfModel } from '@/server/pdf-model'
import { PdfDocument } from './PdfDocument'

// The PDF as bytes. A separate file so that tests and the route do not import the layout.
export async function renderPdf(model: PdfModel): Promise<Uint8Array> {
  return renderToBuffer(<PdfDocument model={model} />)
}
