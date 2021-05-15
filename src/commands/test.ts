import { CommandMessageContext, ICommand } from "../handlers/CommandHandler";

export default class EchoCommand implements ICommand {
  public name = 'test';
  public aliases = ['test'];
  permissions = [];
  async run(context: CommandMessageContext) {
    const { message } = context;
    message.reply("This is a test message!");
    return;
  }
}
