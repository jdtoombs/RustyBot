import { AbstractCommand, CommandMessageContext } from "../../handlers/CommandHandler";

export default class EchoCommand extends AbstractCommand {
  constructor(category: string) {
    super({
      name: 'echo',
      aliases: ['echo'],
      category: category
    });
  }

  async run(context: CommandMessageContext) {
    context.message.reply(context.content);
  }
}
