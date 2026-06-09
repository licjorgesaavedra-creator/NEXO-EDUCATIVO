/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Workshop {
  id: string;
  title: string;
  type: 'family' | 'school';
  slogan: string;
  description: string;
  objectives: string[];
  duration: string;
  methodology: string;
  topics: string[];
  badgeUrl?: string;
  iconName: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  benefits: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedWorkshops?: string[];
}

