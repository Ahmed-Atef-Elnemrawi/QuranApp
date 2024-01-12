import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Logger } from './Logger';

type LevelStyle = [color:string, background:string];

const FONT_SIZE = 1.4;

const TIMESTAMP_STYLE = `
  display:inline-block;
  background: #8080806f;
  font-weight: 900;
  font-size:${FONT_SIZE}em`;

const LEVEL_STYLE = (style: LevelStyle) => `
  color: ${style[0]};
  background: ${style[1]};
  display: inline-block;
  padding-inline-start: 0.5em;
  margin-inline: 0.5em;
  font-weight: 900;
  font-size: ${FONT_SIZE}em;`;

const MESSAGE_STYLE = `
  display: inline-block;
  font-weight: 900;
  font-style: italic;
  font-size: ${FONT_SIZE - 0.08}em`;

const DATA_STYLE = `
  font-family: 'Courier New', monospace;
  font-size: ${FONT_SIZE}em;
  font-weight: 900;
  color: #f5f5dc;
  display: block;
  margin-top:.5em;
  white-space: pre;`;

const LEVELS: Record<string, number> = {
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
};

@Injectable()
export class LoggingService implements Logger {

  trace(message: string, data?: any) {
    this.log('trace', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  private log(level: keyof typeof LEVELS, message: string, data?: undefined) {
    if (LEVELS[level] < LEVELS[environment.logLevel]) {
      return;
    }

    const levelStyle = this.selectLevelStyle(level);
    const timestamp = this.getTimeStamp();
    const content = this.buildMessage(level, timestamp, message, data ?? '');
    this.logToConsole(content, levelStyle);

    if (level === 'error') {
      console.error(data);
    }

    // Log to server
    // this.sendToServer(level, content);
  }

  private logToConsole(content: string, levelStyle: LevelStyle) {
    console.log(
      content,
      TIMESTAMP_STYLE,
      LEVEL_STYLE(levelStyle),
      MESSAGE_STYLE,
      DATA_STYLE
    );
  }

  private getTimeStamp() {
    const date = new Date();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);

    return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private buildMessage(
    level: string,
    timestamp: string,
    message: string,
    data: any
  ) {
    return `%c${timestamp} %c${
      level.toLocaleUpperCase().trimEnd() + ' '
    }%c${message} \n %c${JSON.stringify(data)}`;
  }

  private selectLevelStyle(level: string): LevelStyle {
    let style: LevelStyle = ['', ''];

    switch (level) {
      case 'error':
        style = ['white','red' ];
        break;
      case 'warn':
        style = ['black', 'yellow'] ;
        break;
      case 'debug':
        style =  ['white', 'blue'] ;
        break;
      case 'info':
        style = ['white', 'green'] ;
        break;

      default:
        style = ['white', 'grey'] ;
    }
    return style;
  }

  // private sendToServer(level: string, content: string) {
  //   return this.http
  //     .post('/logs', {
  //       level,
  //       content,
  //     })
  //     .subscribe();
  // }
}
