import { getWhyRefactoringContent } from '../data/whyRefactoringContent'
import { useI18n } from '../i18n/useI18n'

function renderMarkedLine(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="why-refactoring__mark">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

/**
 * Scannable “why refactoring” card: lead, flow hint, four short blocks.
 */
export function WhyRefactoring() {
  const { lang } = useI18n()
  const c = getWhyRefactoringContent(lang)

  return (
    <section className="page-section" aria-labelledby="why-refactoring-heading">
      <article className="why-refactoring">
        <h2 id="why-refactoring-heading" className="why-refactoring__title">
          {c.title}
        </h2>
        <p className="why-refactoring__lead">{c.lead}</p>

        <div className="why-refactoring__flow" aria-hidden="true">
          <span className="why-refactoring__flow-node">{c.flowBefore}</span>
          <span className="why-refactoring__flow-arrow">→</span>
          <span className="why-refactoring__flow-node">{c.flowAfter}</span>
        </div>

        <div className="why-refactoring__sections">
          {c.blocks.map((block) => (
            <div key={block.title} className="why-refactoring__section">
              <div className="why-refactoring__rail" />
              <div className="why-refactoring__section-inner">
                <h3 className="why-refactoring__section-title">{block.title}</h3>
                <ul className="why-refactoring__list">
                  {block.items.map((item, idx) => (
                    <li
                      key={`${block.title}-${idx}`}
                      className="why-refactoring__item"
                    >
                      <span className="why-refactoring__bullet" aria-hidden="true" />
                      <span>{renderMarkedLine(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
