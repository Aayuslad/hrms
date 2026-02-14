package com.aayush.lad.hrms.modules.games.controllers;

import com.aayush.lad.hrms.core.result.Result;
import com.aayush.lad.hrms.core.result.ResultMapper;
import com.aayush.lad.hrms.modules.games.dtos.read.GameResponse;
import com.aayush.lad.hrms.modules.games.dtos.read.GameSummaryResponse;
import com.aayush.lad.hrms.modules.games.dtos.write.*;
import com.aayush.lad.hrms.modules.games.services.GameService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/games")
public class GameController {

    private final GameService gameService;

    @GetMapping("/{id}")
    public ResponseEntity<Result<GameResponse>> get(@PathVariable UUID id) {
        GameResponse response = gameService.getOne(id);
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @GetMapping
    public ResponseEntity<Result<List<GameSummaryResponse>>> getAll() {
        List<GameSummaryResponse> response = gameService.getAll();
        return ResultMapper.handle(HttpStatus.OK, response);
    }

    @PostMapping
    public ResponseEntity<Result<Void>> create(
            @Valid @RequestBody CreateGameRequest request) {
        gameService.create(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result<Void>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateGameRequest request) {
        request.setId(id);
        gameService.update(request);
        return ResultMapper.handle(HttpStatus.OK);
    }

    // Book a specific slot for current user
    @PostMapping("/{id}/slots/book")
    public ResponseEntity<Result<Void>> bookSlot(
            @PathVariable UUID id,
            @RequestBody BookSlotRequest request) {
        request.setGameId(id);
        gameService.bookSlot(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    // Wait for a specific booked slot to be cancelled (option 1)
    // TODO: add notification + timed confirmation flow.
    @PostMapping("/{gameId}/slots/{slotId}/wait")
    public ResponseEntity<Result<Void>> waitForSpecificSlot(
            @PathVariable UUID gameId,
            @PathVariable UUID slotId, @Valid @RequestBody WaitSpecificSlotRequest request) {
        request.setGameId(gameId);
        request.setSlotId(slotId);
        gameService.waitForSpecificSlot(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    // Wait for any slot on a given day (option 2). Creates a pending any-slot entry.
    // TODO: allocation algorithm + notify user with 10 minute confirmation window.
    @PostMapping("/{id}/slots/wait")
    public ResponseEntity<Result<Void>> waitForAnySlot(
            @PathVariable UUID id,
            @RequestBody WaitAnySlotRequest request) {
        request.setGameId(id);
        gameService.waitForAnySlot(request);
        return ResultMapper.handle(HttpStatus.CREATED);
    }

    // Cancel a confirmed slot. Only organiser can cancel.
    @PatchMapping("/{gameId}/slots/{slotId}/cancel")
    public ResponseEntity<Result<Void>> cancelSlot(
            @PathVariable UUID gameId,
            @PathVariable UUID slotId) {
        gameService.cancelSlot(gameId, slotId);
        return ResultMapper.handle(HttpStatus.OK);
    }

    // to Perform action (accept/reject) on empty slot notification received by a user. (for option 2)
    @PostMapping("/{gameId}/slots/{queuedSlotId}/{action}")
    public ResponseEntity<Result<Void>> slotAction(
            @PathVariable UUID queuedSlotId,
            @PathVariable String action, @RequestBody QueuedSlotActionRequest request) {
        request.setQueuedSlotId(queuedSlotId);
        request.setAction(action);
        gameService.slotAction(request);
        return ResultMapper.handle(HttpStatus.OK);
    }
}