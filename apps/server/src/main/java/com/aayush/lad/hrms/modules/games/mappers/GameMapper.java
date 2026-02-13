package com.aayush.lad.hrms.modules.games.mappers;

import com.aayush.lad.hrms.core.services.CurrentUserService;
import com.aayush.lad.hrms.modules.games.dtos.read.GameResponse;
import com.aayush.lad.hrms.modules.games.dtos.read.GameSummaryResponse;
import com.aayush.lad.hrms.modules.games.dtos.read.internal.GameSlotResponse;
import com.aayush.lad.hrms.modules.games.dtos.write.CreateGameRequest;
import com.aayush.lad.hrms.modules.games.dtos.write.UpdateGameRequest;
import com.aayush.lad.hrms.modules.games.models.Game;
import com.aayush.lad.hrms.modules.games.models.GameSlot;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class GameMapper {

    private final ModelMapper mapper;
    private final CurrentUserService currentUserService;

    public Game create(CreateGameRequest request) {
        Game game = mapper.map(request, Game.class);
        game.setCreatedBy(currentUserService.getCurrentUserEntity());
        return game;
    }

    public void update(UpdateGameRequest request, Game game)
    {
        mapper.map(request, game);
        game.setUpdatedBy(currentUserService.getCurrentUserEntity());
    }

    // summary list of all
    public List<GameSummaryResponse> toResponseList(List<Game> games) {
        return games.stream()
                .map(x -> mapper.map(x, GameSummaryResponse.class))
                .toList();
    }

    // detaild for one
    public GameResponse toResponse(Game game) {
        return mapper.map(game, GameResponse.class);
    }

    public GameSlotResponse toResponse(GameSlot slot) {
        return mapper.map(slot, GameSlotResponse.class);
    }
}
