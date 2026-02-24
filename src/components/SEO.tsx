import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

const defaultMeta = {
  title: 'TeamLead - AI-Powered Team Management & Task Tracking',
  description: 'Streamline your team\'s workflow with AI-powered task generation, intelligent capacity planning, and real-time collaboration. Manage tasks, track milestones, and optimize team performance.',
  image: '/og-image.png',
  type: 'website',
};

export const SEO = ({ 
  title, 
  description, 
  image, 
  type = 'website',
  noindex = false 
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;
  
  const metaTitle = title ? `${title} | TeamLead` : defaultMeta.title;
  const metaDescription = description || defaultMeta.description;
  const metaImage = image || defaultMeta.image;
  const fullImageUrl = metaImage.startsWith('http') ? metaImage : `${window.location.origin}${metaImage}`;

  useEffect(() => {
    // Update document title
    document.title = metaTitle;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', metaDescription, false);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow', false);
    
    // Open Graph
    updateMetaTag('og:title', metaTitle);
    updateMetaTag('og:description', metaDescription);
    updateMetaTag('og:image', fullImageUrl);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', type);
    
    // Twitter
    updateMetaTag('twitter:title', metaTitle, false);
    updateMetaTag('twitter:description', metaDescription, false);
    updateMetaTag('twitter:image', fullImageUrl, false);
    updateMetaTag('twitter:url', currentUrl, false);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
  }, [metaTitle, metaDescription, fullImageUrl, currentUrl, type, noindex]);

  return null;
};
