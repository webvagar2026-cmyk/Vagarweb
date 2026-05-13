'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import mapaImg from '@/assets/mapa.webp';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { PropertyCard } from './PropertyCard';
import { type Property } from '@/lib/types';
import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';

interface InteractiveMapProps {
  properties: Property[];
  selectedNodeId?: string | null;
}

const InteractiveMap = ({ properties, selectedNodeId }: InteractiveMapProps) => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Ref to store the starting position of a click/drag
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (selectedNodeId && transformComponentRef.current) {
      const property = properties.find((p) => p.map_node_ids?.includes(selectedNodeId));
      if (property) {
        setSelectedProperty(property);
        // Usamos un selector de ID para encontrar el elemento en el DOM
        transformComponentRef.current.zoomToElement(selectedNodeId, 2, 300);
      }
    }
  }, [selectedNodeId, properties, svgContent]);

  useEffect(() => {
    fetch('/svg-nodos.svg')
      .then((res) => res.text())
      .then((text) => {
        // Limpia los saltos de línea y espacios que rompen el parser
        const cleanedText = text.replace(/[\r\n\t]+/g, ' ').replace(/>\s+</g, '><');
        setSvgContent(cleanedText);
      });
  }, []);

  const handlePropertyClick = (e: React.MouseEvent, property: Property) => {
    e.stopPropagation(); // Prevent map background click
    router.push(`/chalets/${property.slug}`);
  };

  const handleCloseCard = () => {
    setSelectedProperty(null);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartPos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartPos.current) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

    const dx = clientX - dragStartPos.current.x;
    const dy = clientY - dragStartPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If movement is small (less than 5px), consider it a click and close the card
    if (distance < 5) {
      handleCloseCard();
    }

    dragStartPos.current = null;
  };

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'g' && domNode.attribs.id) {
        const shape = domNode.children.find(
          (child) => child instanceof Element && (child.name === 'polygon' || child.name === 'path')
        ) as Element | undefined;

        if (shape) {
          const property = properties.find((p) => p.map_node_ids?.includes(domNode.attribs.id));

          if (property) {
            const { class: originalClassName, style: shapeStyle, ...restShapeAttribs } = shape.attribs;
            const { style: groupStyle, ...restGroupAttribs } = domNode.attribs;

            let dynamicClasses = 'interactive-polygon';
            // Add category class if available
            if (property.category) {
              dynamicClasses += ` ${property.category}`;
            }

            if (hoveredPropertyId === property.id) {
              dynamicClasses += ' hovered';
            }
            if (selectedProperty?.id === property.id) {
              dynamicClasses += ' selected';
            }

            const ShapeTag = shape.name as "polygon" | "path";

            let centerX = 0;
            let centerY = 0;
            let showText = false;

            if (ShapeTag === 'polygon' && shape.attribs.points) {
              const pointsStr = shape.attribs.points.trim();
              const points = pointsStr.split(/[\s,]+/);

              const parsedPoints: { x: number, y: number }[] = [];
              for (let i = 0; i < points.length; i += 2) {
                const x = Number(points[i]);
                const y = Number(points[i + 1]);
                if (!isNaN(x) && !isNaN(y)) {
                  parsedPoints.push({ x, y });
                }
              }

              if (parsedPoints.length > 0) {
                let twiceArea = 0;
                let x = 0;
                let y = 0;
                const nPts = parsedPoints.length;

                // Algoritmo de "Centroide de Área" (Area Centroid / Center of Mass)
                for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
                  const p1 = parsedPoints[i];
                  const p2 = parsedPoints[j];
                  const f = (p1.x * p2.y) - (p2.x * p1.y);
                  twiceArea += f;
                  x += (p1.x + p2.x) * f;
                  y += (p1.y + p2.y) * f;
                }

                const f = twiceArea * 3;

                if (f === 0 || isNaN(f)) {
                  // Fallback: Promedio aritmético de los vértices si el área es 0 (línea)
                  centerX = parsedPoints.reduce((acc, p) => acc + p.x, 0) / nPts;
                  centerY = parsedPoints.reduce((acc, p) => acc + p.y, 0) / nPts;
                } else {
                  centerX = x / f;
                  centerY = y / f;
                }
                showText = true;
              }
            }

            return (
              <g
                {...restGroupAttribs}
                onClick={(e) => handlePropertyClick(e, property)}
                onMouseEnter={() => {
                  setHoveredPropertyId(property.id);
                  setSelectedProperty(property);
                }}
                onMouseLeave={() => setHoveredPropertyId(null)}
              >
                <ShapeTag {...restShapeAttribs} className={`${originalClassName || ''} ${dynamicClasses}`.trim()} />
                {showText && (
                  <text
                    x={centerX}
                    y={centerY}
                    transform={shape.attribs.transform}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none fill-white font-bold"
                    style={{
                      fontSize: '200px',
                      textShadow: '0px 0px 100px rgba(0,0,0,0.8), 0px 200px 400px rgba(0,0,0,0.6)',
                      userSelect: 'none'
                    }}
                  >
                    {property.name.toUpperCase().split(' ').map((word, index, arr) => (
                      <tspan
                        key={index}
                        x={centerX}
                        dy={index === 0 ? `-${(arr.length - 1) * 0.5}em` : '1em'}
                      >
                        {word}
                      </tspan>
                    ))}
                  </text>
                )}
              </g>
            );
          } else {
            const { class: originalClassName, style: shapeStyle, ...restShapeAttribs } = shape.attribs;
            const { style: groupStyle, ...restGroupAttribs } = domNode.attribs;
            const ShapeTag = shape.name as "polygon" | "path";
            return (
              <g {...restGroupAttribs} className="pointer-events-none opacity-0">
                <ShapeTag {...restShapeAttribs} className={originalClassName} />
              </g>
            );
          }
        }
      }
      // No es necesario devolver nada si no se reemplaza, 
      // html-react-parser continuará con el renderizado por defecto.
    },
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#C5D594]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1.2}
        initialPositionX={-500}
        initialPositionY={-200}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <React.Fragment>
            <div className="absolute top-3 left-3  z-20 flex flex-col gap-2">
              <button onClick={(e) => { e.stopPropagation(); zoomIn(); }} className="bg-white p-2 w-8.5 rounded-md shadow-md flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); zoomOut(); }} className="bg-white p-2 w-8.5 rounded-md shadow-md flex items-center justify-center">
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); resetTransform(); }} className="bg-white w-8.5 p-2 rounded-md shadow-md flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <div className="relative w-[6027px] bg-[#C5D594]">
                {/* Custom Placeholder */}
                {mapaImg.blurDataURL && (
                  <div
                    className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-700 ${isMapLoaded ? 'opacity-0' : 'opacity-100'}`}
                    style={{
                      backgroundImage: `url(${mapaImg.blurDataURL})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: 'blur(20px)',
                      transform: 'scale(1.1)'
                    }}
                  />
                )}
                <Image
                  src={mapaImg}
                  alt="Mapa de propiedades"
                  fill
                  style={{ objectFit: 'contain' }}
                  className={`absolute top-0 left-0 transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
                  priority
                  quality={100}
                  unoptimized
                  onLoad={() => setIsMapLoaded(true)}
                />
                <div className="absolute top-0 left-0 w-full h-full">
                  {svgContent && parse(svgContent, options)}
                </div>
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
      {selectedProperty && (
        <div
          className="absolute bottom-25 right-4 transform  z-20 w-72"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-lg px-1.25 pt-1 pb-3 overflow-hidden">
            <button onClick={handleCloseCard} className="absolute top-2 right-2 w-6 bg-white rounded-full p-1 z-30 leading-none">
              &times;
            </button>
            <PropertyCard property={selectedProperty} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
