<template>
  <div id="map-zoom"></div>
</template>
<script setup lang="ts">
  import * as d3 from 'd3';
  import { message } from 'ant-design-vue';
  // @ts-expect-error
  import * as turf from '@turf/turf';

  onMounted(async () => {
    const mapData: {
      type: string;
      features: Array<{ type: string; properties: any; geometry: any }>;
    } = (await d3.json(
      'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
    )) as any;
    const width = 975;
    const height = 610;
    const scale = height / 1.25;
    const mercator = d3
      .geoMercator()
      .center([107, 31])
      .scale(scale)
      .translate([width / 2, height / 2 + 50]);
    const path = d3.geoPath().projection(mercator);

    const reset = () => {
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform as any,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()!).invert([width / 2, height / 2])
        );
    };

    const svg = d3
      .select('#map-zoom')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .on('click', reset);

    const g = svg.append('g');
    let isZoomed = false;
    const provinces = g
      .append('g')
      .attr('fill', 'white')
      .attr('stroke', '#444')
      .attr('stroke-width', 0.5)
      .attr('cursor', 'pointer')
      .selectAll('path')
      .data(
        mapData.features.map((feature) => ({
          ...turf.rewind(feature, { reverse: true }),
          level: 1,
        }))
      )
      .join('path')
      .on('mouseenter', (e) => {
        d3.select(e.target).transition().attr('fill', '#f00');
      })
      .on('mouseleave', (e) => {
        d3.select(e.target).transition().attr('fill', 'white');
      })
      .on('click', (e, d) => {
        message.info(d.properties.name);
        if (isZoomed) {
          reset();
        } else {
          clicked(e, d);
        }
        isZoomed = !isZoomed;
      })
      .attr('d', path as any);
    provinces.append('title').text((d) => d.properties.name);
    const zoomed = (event: any) => {
      const { transform } = event;
      g.attr('transform', transform);
      g.attr('stroke-width', 1 / transform.k);
      g.selectAll('text').attr('font-size', `${0.5 / transform.k}rem`);
    };
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed);
    svg.call(zoom as any);

    const clicked = (event: MouseEvent, d: any) => {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      // provinces.transition().style('fill', null);
      d3.select(event.target as any).transition();
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform as any,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(
              Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
            )
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node())
        );
    };
  });
</script>
