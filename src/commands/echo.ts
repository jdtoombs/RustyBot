import { CommandMessageContext, ICommand } from "../handlers/CommandHandler";

export default class EchoCommand implements ICommand {
  public name = 'echo';
  public aliases = ['echo'];
  permissions = [];
  async run(context: CommandMessageContext) {
    const { content, message } = context;
    message.reply(content);
    return;
  }
}
