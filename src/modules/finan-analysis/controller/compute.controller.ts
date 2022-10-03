import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ComputeAlphaDto } from '@module/finan-analysis/dto/compute.dto';
import { ComputePublisher } from '@module/finan-analysis/queue/publisher/compute.publisher';

@Controller('com')
export class ComputeController {
  constructor(private computePubliser: ComputePublisher) {}

  @Post('/alpha')
  @UsePipes(new ValidationPipe({ transform: true }))
  async alpha(@Body() request: ComputeAlphaDto) {
    return await this.computePubliser.publishComputeAlpha(request);
  }
}
