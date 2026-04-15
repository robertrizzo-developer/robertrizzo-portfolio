import { getPseudocodeLines } from '../data/pseudocodeByFile'
import { useI18n } from '../i18n/useI18n'

function segmentTooltip(role, t) {
  const key = `layers.${role}Tooltip`
  const s = t(key)
  return s === key ? role : s
}

/**
 * Same file cards for code and explanation: only the inner body changes.
 * `focusedRole` dims non-matching segments / pseudocode lines in both modes.
 */
export function CodeViewer({ example, focusedRole, hideMeta, mode = 'code' }) {
  const { lang, t } = useI18n()
  const dimOthers = focusedRole != null

  const primary = example.files.filter((f) => f.display !== 'secondary')
  const secondary = example.files.filter((f) => f.display === 'secondary')
  const files = [...primary, ...secondary]

  return (
    <div className="code-viewer">
      {!hideMeta && (
        <div className="code-viewer__meta">
          <h2 className="code-viewer__title">{example.title}</h2>
          <p className="code-viewer__subtitle">{example.subtitle}</p>
        </div>
      )}

      {files.map((file) => {
        const tier = file.display === 'secondary' ? 'secondary' : 'primary'
        const pseudoLines =
          mode === 'explanation' ? getPseudocodeLines(lang, file.file) : null

        return (
          <article
            key={file.file}
            className={`code-file code-file--${tier}`}
          >
            <header className="code-file__header">
              {file.file}
              {tier === 'secondary' && (
                <span className="code-file__badge">{t('codeViewer.legacyMapping')}</span>
              )}
            </header>
            {mode === 'code' ? (
              <pre className="code-file__pre" tabIndex={0}>
                <code className="code-file__code">
                  {file.segments.map((seg, i) => {
                    const dimmed = dimOthers && seg.role !== focusedRole
                    return (
                      <span
                        key={`${file.file}-${i}`}
                        className={[
                          'segment',
                          `segment--${seg.role}`,
                          dimmed ? 'segment--dimmed' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        title={segmentTooltip(seg.role, t)}
                      >
                        {seg.text}
                      </span>
                    )
                  })}
                </code>
              </pre>
            ) : (
              <div className="code-file__pseudo-body" tabIndex={0}>
                {pseudoLines.map((line, i) => {
                  const role = line.role ?? 'other'
                  const dimmed = dimOthers && role !== focusedRole
                  return (
                    <div
                      key={`${file.file}-p-${i}`}
                      className={[
                        'pseudocode-line',
                        'segment',
                        `segment--${role}`,
                        dimmed ? 'segment--dimmed' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      title={segmentTooltip(role, t)}
                    >
                      {line.text}
                    </div>
                  )
                })}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
