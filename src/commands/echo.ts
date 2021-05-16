import { AbstractCommand, CommandMessageContext } from "../handlers/CommandHandler";

export default class EchoCommand extends AbstractCommand {
  constructor() {
    super({
      name: 'echo',
      aliases: ['echo']
    });
  }

  async run(context: CommandMessageContext) {
    context.message.reply(context.content);
  }
}
