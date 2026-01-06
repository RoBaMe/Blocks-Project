import { Controller, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Redirect('/api', 301)
    redirectToSwagger() {
        return;
    }
}
