import { api } from './api';
import type {
  EducationArticleDetail,
  EducationArticleSummary,
  EducationCategory,
  EducationSearchResult,
  EducationSectionSummary,
} from '../types';

export const educationService = {
  async getSections(): Promise<EducationSectionSummary[]> {
    const response = await api.get<EducationSectionSummary[]>('/education/sections');
    return response.data;
  },

  async getArticles(params?: {
    category?: EducationCategory;
    search?: string;
  }): Promise<EducationArticleSummary[]> {
    const response = await api.get<EducationArticleSummary[]>('/education/articles', {
      params,
    });
    return response.data;
  },

  async getArticle(slug: string): Promise<EducationArticleDetail> {
    const response = await api.get<EducationArticleDetail>(`/education/articles/${slug}`);
    return response.data;
  },

  async getRelated(slug: string): Promise<EducationArticleSummary[]> {
    const response = await api.get<EducationArticleSummary[]>(`/education/related/${slug}`);
    return response.data;
  },

  async search(q: string): Promise<EducationSearchResult[]> {
    const response = await api.get<EducationSearchResult[]>('/education/search', {
      params: { q },
    });
    return response.data;
  },
};
