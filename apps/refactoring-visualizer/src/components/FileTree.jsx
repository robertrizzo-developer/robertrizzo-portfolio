import { useI18n } from '../i18n/useI18n'

/**
 * Educational project tree: fictional files + highlighted case-study files (real).
 */

const BEFORE_ROWS = [
  {
    id: 'booking-api',
    depth: 0,
    label: 'BookingApiController.java',
    pickRole: null,
    contains: ['controller', 'service', 'mapper', 'other'],
    real: true,
  },
  {
    id: 'user-ctl',
    depth: 0,
    label: 'UserController.java',
    pickRole: 'controller',
    contains: ['controller'],
    real: false,
  },
  {
    id: 'pay-ctl',
    depth: 0,
    label: 'PaymentController.java',
    pickRole: 'controller',
    contains: ['controller'],
    real: false,
  },
  { id: 'conv-folder', depth: 0, label: 'conversion/', folder: true },
  {
    id: 'conv',
    depth: 1,
    label: 'LegacyConversion.java',
    pickRole: 'mapper',
    contains: ['mapper'],
    real: true,
  },
]

const AFTER_ROWS = [
  { id: 'c-folder', depth: 0, label: 'controller/', folder: true },
  {
    id: 'bc',
    depth: 1,
    label: 'BookingController.java',
    pickRole: 'controller',
    contains: ['controller'],
    real: true,
  },
  {
    id: 'uc',
    depth: 1,
    label: 'UserController.java',
    pickRole: 'controller',
    contains: ['controller'],
    real: false,
  },
  {
    id: 'pc',
    depth: 1,
    label: 'PaymentController.java',
    pickRole: 'controller',
    contains: ['controller'],
    real: false,
  },
  { id: 's-folder', depth: 0, label: 'service/', folder: true },
  {
    id: 'bs',
    depth: 1,
    label: 'BookingService.java',
    pickRole: 'service',
    contains: ['service'],
    real: true,
  },
  {
    id: 'us',
    depth: 1,
    label: 'UserService.java',
    pickRole: 'service',
    contains: ['service'],
    real: false,
  },
  {
    id: 'ps',
    depth: 1,
    label: 'PaymentService.java',
    pickRole: 'service',
    contains: ['service'],
    real: false,
  },
  { id: 'm-folder', depth: 0, label: 'modelMapper/', folder: true },
  {
    id: 'bm',
    depth: 1,
    label: 'BookingMapper.java',
    pickRole: 'mapper',
    contains: ['mapper'],
    real: true,
  },
  {
    id: 'um',
    depth: 1,
    label: 'UserMapper.java',
    pickRole: 'mapper',
    contains: ['mapper'],
    real: false,
  },
]

function rowActive(row, focusedRole) {
  if (focusedRole == null) return false
  return row.contains?.includes(focusedRole)
}

export function FileTree({ variant, focusedRole, onSelectRole }) {
  const { t } = useI18n()
  const rows = variant === 'before' ? BEFORE_ROWS : AFTER_ROWS

  function handleRowClick(row) {
    if (row.folder) return
    if (row.pickRole == null) {
      onSelectRole(null)
      return
    }
    onSelectRole(focusedRole === row.pickRole ? null : row.pickRole)
  }

  function rowTitle(row) {
    if (row.pickRole == null) return t('fileTree.titleShowAll')
    const layerName = t(`layers.${row.pickRole}`)
    return t('fileTree.titleHighlight').replace('{{layer}}', layerName)
  }

  return (
    <div className="file-tree" aria-label={t('fileTree.aria')}>
      <div className="file-tree__caption">{t('fileTree.caption')}</div>
      <p className="file-tree__note">{t('fileTree.note')}</p>
      <ul className="file-tree__list" role="list">
        {rows.map((row) => {
          if (row.folder) {
            return (
              <li
                key={row.id}
                className="file-tree__row file-tree__row--folder"
                style={{ paddingLeft: `${0.5 + row.depth * 0.75}rem` }}
              >
                <span className="file-tree__chevron" aria-hidden>
                  ▸
                </span>
                <span className="file-tree__name">{row.label}</span>
              </li>
            )
          }

          const active = rowActive(row, focusedRole)
          const swatchKind = row.pickRole == null ? 'neutral' : row.pickRole
          const example = row.real === false

          return (
            <li key={row.id} className="file-tree__row-wrap">
              <button
                type="button"
                className={[
                  'file-tree__row',
                  'file-tree__row--file',
                  example ? 'file-tree__row--example' : '',
                  row.real ? 'file-tree__row--real' : '',
                  active ? 'file-tree__row--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ paddingLeft: `${0.5 + row.depth * 0.75}rem` }}
                onClick={() => handleRowClick(row)}
                title={rowTitle(row)}
              >
                <span
                  className="file-tree__swatch"
                  data-role={swatchKind}
                  aria-hidden
                />
                <span className="file-tree__name">{row.label}</span>
                {row.real && (
                  <span className="file-tree__badge file-tree__badge--real">
                    {t('fileTree.badgeReal')}
                  </span>
                )}
                {example && (
                  <span className="file-tree__badge file-tree__badge--example">
                    {t('fileTree.badgeExample')}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
