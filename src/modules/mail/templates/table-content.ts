export type TableData = {
  headers?: Array<string | number>
  rows?: Array<Array<string | number>>
}

/**
 * Generate a content block for emails with optional intro, content, a styled table, and footer.
 * Mirrors the style of base-content template with an additional table section.
 */
export const tableContentEmailTemplate = (
  intro: string = '',
  content: string = '',
  table: TableData = {},
  footer: string = ''
): string => {
  const hasHeaders = Array.isArray(table.headers) && table.headers.length > 0
  const hasRows = Array.isArray(table.rows) && table.rows.length > 0

  const tableHtml =
    hasHeaders || hasRows
      ? `
	<table
		width="100%"
		cellpadding="0"
		cellspacing="0"
		style="width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-family: Helvetica, sans-serif; background: #ffffff;"
	>
		${
      hasHeaders
        ? `<thead>
				<tr>
					${(table.headers || [])
            .map(
              (h) => `
						<th
							align="left"
							style="text-align: left; padding: 12px 16px; background: #f6f6f6; border-bottom: 1px solid #eaeaea; font-size: 14px; font-weight: 600; color: #333;"
						>${String(h)}</th>`
            )
            .join('')}
				</tr>
			</thead>`
        : ''
    }
		${
      hasRows
        ? `<tbody>
				${(table.rows || [])
          .map(
            (row) => `
					<tr>
						${row
              .map(
                (cell) => `
							<td
								style="padding: 12px 16px; border-bottom: 1px solid #eaeaea; font-size: 14px; color: #444; vertical-align: top;"
								valign="top"
							>${String(cell)}</td>`
              )
              .join('')}
					</tr>`
          )
          .join('')}
			</tbody>`
        : ''
    }
	</table>`
      : ''

  const footerHtml = footer
    ? `<p style="font-family: Helvetica, sans-serif; font-size: 13px; color: #777; margin: 8px 0 0;">${footer}</p>`
    : ''

  return `
	<!-- START MAIN CONTENT AREA -->
	<tr>
		<td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">
			${intro ? `<p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0 0 16px;">${intro}</p>` : ''}
			${content ? `<p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0 0 16px;">${content}</p>` : ''}
			${tableHtml}
			${footerHtml}
		</td>
	</tr>
	<!-- END MAIN CONTENT AREA -->
	`
}

// CommonJS compatibility for existing require(...) style imports if needed
module.exports = { tableContentEmailTemplate }
