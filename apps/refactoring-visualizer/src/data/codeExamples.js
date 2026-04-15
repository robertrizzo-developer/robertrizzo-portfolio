/**
 * Static pedagogical dataset. Segments use controller | service | mapper | other.
 * "other" = extra concerns in the old code (no chip in the 3-color legend).
 */

export const HIGHLIGHT_ROLES = ['controller', 'service', 'mapper']

/** @typedef {'controller'|'service'|'mapper'|'other'} SegmentRole */

/** @typedef {{ role: SegmentRole, text: string }} CodeSegment */

/** @typedef {{ file: string, segments: CodeSegment[], display?: 'primary' | 'secondary' }} CodeFile */

/** @typedef {{ id: string, title: string, subtitle: string, files: CodeFile[] }} CodeExample */

/** @type {CodeExample} */
export const beforeExample = {
  id: 'before',
  title: 'Before (original code)',
  subtitle: 'One class does many jobs at once.',
  files: [
    {
      file: 'BookingApiController.java (excerpt)',
      segments: [
        {
          role: 'other',
          text: `@Transactional
`,
        },
        {
          role: 'controller',
          text: `@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@PutMapping("/{id}")
public ResponseEntity<BookingResponse> updateBooking(@PathVariable Long id,
        @Valid @RequestBody BookingRequest bookingRequest) {
    `,
        },
        {
          role: 'controller',
          text: `String accept = request.getHeader("Accept");
    if (accept != null && accept.contains("application/json")) {
        try {
`,
        },
        {
          role: 'service',
          text: `            Booking existing = bookingRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

            if (bookingRequest.startTime().isAfter(bookingRequest.endTime())
                    || bookingRequest.startTime().isEqual(bookingRequest.endTime())) {
                throw new IllegalArgumentException("Start time must be before end time");
            }
            if (bookingRequest.startTime().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Booking cannot start in the past");
            }

            Room room = roomRepository.findById(bookingRequest.roomId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Room not found with id: " + bookingRequest.roomId()));

            List<Booking> conflicts = bookingRepository.findConflictingBookingsExcluding(
                    room.getId(), id, bookingRequest.startTime(), bookingRequest.endTime());
            if (!conflicts.isEmpty()) {
                throw new BookingConflictException("Room is already booked during this time");
            }
`,
        },
        {
          role: 'mapper',
          text: `
            Conversion.mapBookingRequestToEntity(bookingRequest, existing, existing.getUser(), room);
`,
        },
        {
          role: 'service',
          text: `
            Booking saved = bookingRepository.save(existing);
`,
        },
        {
          role: 'mapper',
          text: `            BookingResponse dto = Conversion.convertBookingToDto(saved);
`,
        },
        {
          role: 'controller',
          text: `            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (ResourceNotFoundException | BookingConflictException | IllegalArgumentException e) {
            throw e;
        }
`,
        },
        {
          role: 'other',
          text: `        } catch (Exception e) {
            throw new RuntimeException("Failed to update booking", e);
        }
`,
        },
        {
          role: 'controller',
          text: `    }
    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
}
`,
        },
      ],
    },
    {
      file: 'Conversion.java (excerpt)',
      display: 'secondary',
      segments: [
        {
          role: 'mapper',
          text: `public static void mapBookingRequestToEntity(
        BookingRequest dto, Booking entity, User user, Room room) {
    entity.setUser(user);
    entity.setRoom(room);
    entity.setStartTime(dto.startTime());
    entity.setEndTime(dto.endTime());
}
`,
        },
      ],
    },
  ],
}

/** @type {CodeExample} */
export const afterExample = {
  id: 'after',
  title: 'After (refactored code)',
  subtitle: 'Each file has one main job.',
  files: [
    {
      file: 'BookingController.java (excerpt)',
      segments: [
        {
          role: 'controller',
          text: `@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@PutMapping("/{id}")
public ResponseEntity<BookingResponse> updateBooking(
        @PathVariable Long id,
        @Valid @RequestBody BookingRequest request) {

    return ResponseEntity.ok(bookingService.updateBooking(id, request));
}
`,
        },
      ],
    },
    {
      file: 'BookingService.java (excerpt)',
      segments: [
        {
          role: 'service',
          text: `@Transactional
public BookingResponse updateBooking(Long id, BookingRequest request) {
    Booking existing = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

    validateTimeRange(request.startTime(), request.endTime());

    Room room = roomRepository.findById(request.roomId())
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Room not found with id: " + request.roomId()));

    List<Booking> conflicts = bookingRepository.findConflictingBookingsExcluding(
            room.getId(), id, request.startTime(), request.endTime());

    if (!conflicts.isEmpty()) {
        throw new BookingConflictException("Room is already booked during this time");
    }

`,
        },
        {
          role: 'mapper',
          text: `    bookingMapper.mapRequestToEntity(request, existing, existing.getUser(), room);

`,
        },
        {
          role: 'service',
          text: `    Booking saved = bookingRepository.save(existing);
`,
        },
        {
          role: 'mapper',
          text: `    return bookingMapper.toResponse(saved);
}
`,
        },
      ],
    },
    {
      file: 'BookingMapper.java (excerpt)',
      segments: [
        {
          role: 'mapper',
          text: `public void mapRequestToEntity(
        BookingRequest request, Booking entity, User user, Room room) {
    entity.setStartTime(request.startTime());
    entity.setEndTime(request.endTime());
    entity.setUser(user);
    entity.setRoom(room);
}
`,
        },
      ],
    },
  ],
}
