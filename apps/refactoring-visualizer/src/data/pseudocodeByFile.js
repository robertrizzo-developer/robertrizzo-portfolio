/**
 * Pseudocode lines per file — same order as segments in codeExamples.js.
 * `role` matches highlight layers (null/other = no chip color).
 * Keys must match `file` strings on CodeExample.files exactly.
 */

/** @typedef {{ role: 'controller'|'service'|'mapper'|'other'|null, text: string }} PseudoLine */

/** @type {Record<string, PseudoLine[]>} */
const SV = {
  'BookingApiController.java (excerpt)': [
    { role: 'other', text: '@Transactional — körs kring hela metoden (tvärgående).' },
    {
      role: 'controller',
      text: 'NÄR PUT updateBooking(id, BookingRequest) anropas med roll ADMIN/USER:',
    },
    {
      role: 'controller',
      text: '→ LÄS Accept-header. OM JSON → gå in i try-block.',
    },
    {
      role: 'service',
      text:
        '→ HÄMTA befintlig bokning via id. VALIDERA tider. HÄMTA rum. SÖK konflikter (exkl. id). KASTA vid konflikt.',
    },
    {
      role: 'mapper',
      text: '→ ANROPA Conversion.mapBookingRequestToEntity(dto, existing, existing.getUser(), room).',
    },
    {
      role: 'service',
      text: '→ SPARA existing via repository.',
    },
    {
      role: 'mapper',
      text: '→ BYGG BookingResponse med Conversion.convertBookingToDto(saved).',
    },
    {
      role: 'controller',
      text: '→ RETURNERA HTTP 200 OK. VID kända fel: kasta vidare. (HTTP-lager)',
    },
    {
      role: 'other',
      text: '→ VID övrigt Exception: wrappa i RuntimeException (generiskt fel).',
    },
    {
      role: 'controller',
      text: '→ ANNARS: returnera 406 Not Acceptable om fel content-type.',
    },
  ],
  'Conversion.java (excerpt)': [
    {
      role: 'mapper',
      text:
        'mapBookingRequestToEntity(dto, entity, user, room):\n  → sätt user, room, startTime, endTime på entiteten.',
    },
  ],
  'BookingController.java (excerpt)': [
    {
      role: 'controller',
      text:
        'NÄR PUT updateBooking(id, request) med roll ADMIN/USER:\n  → returnera OK(bookingService.updateBooking(id, request)).',
    },
  ],
  'BookingService.java (excerpt)': [
    {
      role: 'service',
      text:
        'NÄR updateBooking(id, request):\n  → HÄMTA bokning. validateTimeRange. HÄMTA rum. SÖK konflikter (exkl. id). KASTA vid konflikt.',
    },
    {
      role: 'mapper',
      text: '→ bookingMapper.mapRequestToEntity(request, existing, existing.getUser(), room)',
    },
    {
      role: 'service',
      text: '→ SPARA existing via repository.',
    },
    {
      role: 'mapper',
      text: '→ returnera bookingMapper.toResponse(saved)',
    },
  ],
  'BookingMapper.java (excerpt)': [
    {
      role: 'mapper',
      text:
        'mapRequestToEntity(request, entity, user, room):\n  → kopiera tider, user och room från begäran till entiteten.',
    },
  ],
}

/** @type {Record<string, PseudoLine[]>} */
const EN = {
  'BookingApiController.java (excerpt)': [
    { role: 'other', text: '@Transactional wraps the whole method (cross-cutting).' },
    {
      role: 'controller',
      text: 'WHEN PUT updateBooking(id, BookingRequest) is called with ADMIN/USER role:',
    },
    {
      role: 'controller',
      text: '→ READ Accept header. IF JSON → enter try block.',
    },
    {
      role: 'service',
      text:
        '→ LOAD existing booking by id. VALIDATE times. LOAD room. FIND conflicts (exclude id). THROW if conflict.',
    },
    {
      role: 'mapper',
      text: '→ CALL Conversion.mapBookingRequestToEntity(dto, existing, existing.getUser(), room).',
    },
    {
      role: 'service',
      text: '→ SAVE existing via repository.',
    },
    {
      role: 'mapper',
      text: '→ BUILD BookingResponse with Conversion.convertBookingToDto(saved).',
    },
    {
      role: 'controller',
      text: '→ RETURN HTTP 200 OK. FOR known errors: rethrow. (HTTP boundary)',
    },
    {
      role: 'other',
      text: '→ FOR other Exception: wrap in RuntimeException (generic failure).',
    },
    {
      role: 'controller',
      text: '→ ELSE: return 406 Not Acceptable if wrong content type.',
    },
  ],
  'Conversion.java (excerpt)': [
    {
      role: 'mapper',
      text:
        'mapBookingRequestToEntity(dto, entity, user, room):\n  → set user, room, startTime, endTime on the entity.',
    },
  ],
  'BookingController.java (excerpt)': [
    {
      role: 'controller',
      text:
        'WHEN PUT updateBooking(id, request) with ADMIN/USER role:\n  → return OK(bookingService.updateBooking(id, request)).',
    },
  ],
  'BookingService.java (excerpt)': [
    {
      role: 'service',
      text:
        'WHEN updateBooking(id, request):\n  → LOAD booking. validateTimeRange. LOAD room. FIND conflicts (exclude id). THROW if conflict.',
    },
    {
      role: 'mapper',
      text: '→ bookingMapper.mapRequestToEntity(request, existing, existing.getUser(), room)',
    },
    {
      role: 'service',
      text: '→ SAVE existing via repository.',
    },
    {
      role: 'mapper',
      text: '→ return bookingMapper.toResponse(saved)',
    },
  ],
  'BookingMapper.java (excerpt)': [
    {
      role: 'mapper',
      text:
        'mapRequestToEntity(request, entity, user, room):\n  → copy times, user, room from request onto entity.',
    },
  ],
}

/**
 * @param {'sv'|'en'} lang
 * @param {string} fileName — must match `CodeFile.file` in codeExamples
 * @returns {PseudoLine[]}
 */
export function getPseudocodeLines(lang, fileName) {
  const table = lang === 'en' ? EN : SV
  const lines = table[fileName]
  return lines ?? [{ role: 'other', text: '—' }]
}
